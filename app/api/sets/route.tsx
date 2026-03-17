import { NextResponse } from "next/server";
import { getSetData } from "@/components/db/Set";

export async function GET() {
  try {
    const res = await getSetData();
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}