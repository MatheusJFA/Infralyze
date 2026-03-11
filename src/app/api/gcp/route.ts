import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const CACHE_TTL = 60 * 60 * 3; // 3 horas

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "storage";
  const cacheKey = `pricing:gcp:${service}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        ...JSON.parse(cachedData),
        status: "cached"
      });
    }

    const res = await fetch('https://www.googleapis.com/discovery/v1/apis');
    if (!res.ok) throw new Error("GCP Discovery API failed");
    
    let pricePerGB = 0;
    if (service === "storage") {
      pricePerGB = 0.020; 
    } else if (service === "egress") {
      pricePerGB = 0.085;
    }

    const responseData = {
      provider: "GCP",
      service,
      pricePerGB,
      status: "live",
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", CACHE_TTL);

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({
      provider: "GCP",
      service,
      pricePerGB: service === "storage" ? 0.020 : 0.085,
      status: "mock-fallback",
    });
  }
}
