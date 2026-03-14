import { getAllCategories } from "@/lib/getCategories";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json(categories);
}
