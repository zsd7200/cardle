import { NextResponse } from "next/server";
import getMonNames from "@/components/db/pokemon";

export async function GET() {
  try {
    const res = await getMonNames();
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}