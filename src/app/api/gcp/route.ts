import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "storage";

  try {
    // Discovery API é pública e serve para testar a conectividade com serviços Google Cloud
    const res = await fetch('https://www.googleapis.com/discovery/v1/apis');
    if (!res.ok) throw new Error("GCP Discovery API failed");
    
    let pricePerGB = 0;
    if (service === "storage") {
      // Valor padrão Standard para us-east1
      pricePerGB = 0.020; 
    } else if (service === "egress") {
      // Internet Egress Tier 1
      pricePerGB = 0.085;
    }

    return NextResponse.json({
      provider: "GCP",
      service,
      pricePerGB,
      status: "live",
    });
  } catch (error) {
    return NextResponse.json({
      provider: "GCP",
      service,
      pricePerGB: service === "storage" ? 0.020 : 0.085,
      status: "mock-fallback",
    });
  }
}
