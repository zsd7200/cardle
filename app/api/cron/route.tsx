import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// this gets called every night at 12am EST
// through vercel.json's cron

export async function GET() {
  try {
    revalidatePath('/daily');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}