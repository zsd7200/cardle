import { NextRequest, NextResponse } from "next/server";
import getSetCollection from "@/components/db/set";

export async function GET(req: NextRequest) {
  try {
    let res = await getSetCollection();
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}