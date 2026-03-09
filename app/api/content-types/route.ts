import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/getCategories";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json(categories);
}
