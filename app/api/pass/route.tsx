import { NextResponse, NextRequest } from "next/server";
import crypto from 'crypto';
import hash from 'stable-hash';
import { Guid } from "guid-typescript";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const enteredWeakHash = hash(body.pass);
    const enteredSafeHash = crypto.createHash('MD5').update(enteredWeakHash).digest('hex');

    const weakHash = hash(process.env.POPULATE_PASS ?? Guid.create().toString());
    const safeHash = crypto.createHash('MD5').update(weakHash).digest('hex');

    if (enteredSafeHash === safeHash) {
      return NextResponse.json(true, {status: 200});
    }

    return NextResponse.json(false, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}