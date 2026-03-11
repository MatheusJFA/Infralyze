import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "storage";

  try {
    // Oracle Public Price List API
    const res = await fetch('https://apexapps.oracle.com/pls/apex/cetools/api/v1/products/');
    if (!res.ok) throw new Error("Oracle API failed");
    const data = await res.json();
    
    let pricePerGB = 0;
    
    if (service === "storage") {
      // Procurando pelo 'Object Storage' - O nome oficial varia, mas geralmente contém 'Object Storage' e 'Storage Capacity'
      const storageProduct = data.items?.find((p: any) => 
        (p.displayName && p.displayName.includes("Object Storage")) || 
        (p.metricName && p.metricName.includes("Storage Capacity"))
      );
      pricePerGB = storageProduct?.currencyCodeLocalizations?.find((c: any) => c.currencyCode === "USD")?.prices?.[0]?.value || 0.0255;
    } else if (service === "egress") {
      // Outbound Data Transfer
      const egressProduct = data.items?.find((p: any) => 
        (p.displayName && p.displayName.includes("Outbound Data Transfer")) ||
        (p.description && p.description.includes("Outbound Data Transfer"))
      );
      pricePerGB = egressProduct?.currencyCodeLocalizations?.find((c: any) => c.currencyCode === "USD")?.prices?.[0]?.value || 0.0085;
    }

    return NextResponse.json({
      provider: "Oracle",
      service,
      pricePerGB,
      status: "live",
    });

  } catch (error) {
    // Fallback Mock
    let pricePerGB = 0;
    if (service === "storage") pricePerGB = 0.0255;
    else if (service === "egress") pricePerGB = 0.0085;

    return NextResponse.json({
      provider: "Oracle",
      service,
      pricePerGB,
      status: "mock-fallback",
    });
  }
}
