import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Build new FormData to forward to HuggingFace
        const proxyForm = new FormData();
        proxyForm.append("file", file);

        const response = await fetch(
            "https://omarhany-dental-x-ray.hf.space/predict",
            {
                method: "POST",
                body: proxyForm,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Upstream error: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[analyze-xray] Proxy error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
