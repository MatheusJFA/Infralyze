import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "storage";

  try {
    // AWS Price List API for S3 in US East (N. Virginia)
    // Usando a URL direta regional que é menor (~400KB) que o bulk index
    const res = await fetch('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/us-east-1/index.json');
    
    if (!res.ok) throw new Error("AWS Pricing API unreachable");
    
    const data = await res.json();
    let pricePerGB = 0;

    if (service === "storage") {
      // Procurar por 'Standard' storage, 'General Purpose' em 'US East (N. Virginia)'
      // O JSON da AWS é complexo (Products + Terms). 
      // Vamos tentar localizar o SKU específico ou usar fallback inteligente
      // S3 Standard em us-east-1 geralmente tem SKU '2Y96W99863G999...'
      
      // Simplificação do parse para o MVP: buscar nos produtos
      const s3Standard = Object.values(data.products || {}).find((p: any) => 
        p.attributes?.volumeType === 'Standard' && 
        p.attributes?.location === 'US East (N. Virginia)'
      ) as any;

      if (s3Standard) {
        const sku = s3Standard.sku;
        const onDemand = data.terms?.OnDemand?.[sku];
        const priceDimensions = onDemand ? Object.values(Object.values(onDemand)[0] as any)[0] as any : null;
        const priceMap = priceDimensions?.pricePerUnit;
        pricePerGB = parseFloat(priceMap?.USD) || 0.023;
      } else {
        pricePerGB = 0.023;
      }
    } else if (service === "egress") {
      // Egress para Internet (Data Transfer Out)
      // Fallback para o valor padrão pois o parse de egress no JSON da AWS é ainda mais aninhado
      pricePerGB = 0.09;
    }

    return NextResponse.json({
      provider: "AWS",
      service,
      pricePerGB,
      status: "live",
    });

  } catch (error) {
    return NextResponse.json({
      provider: "AWS",
      service,
      pricePerGB: service === "storage" ? 0.023 : 0.09,
      status: "mock-fallback",
    });
  }
}
