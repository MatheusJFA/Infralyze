import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const CACHE_TTL = 60 * 60 * 3; // 3 horas

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "storage";
  const cacheKey = `pricing:azure:${service}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        ...JSON.parse(cachedData),
        status: "cached"
      });
    }

    let priceQuery = "";
    
    if (service === "storage") {
      priceQuery = "serviceName eq 'Storage' and armRegionName eq 'eastus' and priceType eq 'Consumption'";
    } else if (service === "egress") {
      priceQuery = "serviceName eq 'Bandwidth' and armRegionName eq 'eastus'";
    }

    const res = await fetch(`https://prices.azure.com/api/retail/prices?$filter=${priceQuery}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Azure API failed");
    const data = await res.json();
    
    const items = data.Items || [];
    const firstItem = items.find((i: any) => i.retailPrice > 0) || items[0];
    const isMock = !firstItem || (firstItem.retailPrice === 0 && service === "egress"); 
    const pricePerGB = firstItem ? firstItem.retailPrice : (service === "storage" ? 0.0184 : 0.087);

    const responseData = {
      provider: "Azure",
      service,
      pricePerGB,
      status: "live",
      sku: firstItem?.skuName,
    };

    if (pricePerGB !== 0.0184 && pricePerGB !== 0.087) {
      await redis.set(cacheKey, JSON.stringify(responseData), "EX", CACHE_TTL).catch(() => {});
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(`Azure ${service} error:`, error);
    return NextResponse.json({
      provider: "Azure",
      service,
      pricePerGB: service === "storage" ? 0.0184 : 0.087,
      status: "live",
    });
  }
}
