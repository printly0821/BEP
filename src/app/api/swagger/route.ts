import { NextResponse } from "next/server";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerDefinition } from "@/lib/swagger";

export async function GET() {
  try {
    const swaggerSpec = swaggerJsdoc(swaggerDefinition);

    return NextResponse.json(swaggerSpec);
  } catch (error) {
    console.error("Swagger 생성 오류:", error);
    return NextResponse.json(
      { error: "Swagger specification generation failed" },
      { status: 500 }
    );
  }
}
