import { NextResponse } from "next/server";
import { getSetIDs } from "@/components/db/Set";

export async function GET() {
  try {
    const res = await getSetIDs();
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}