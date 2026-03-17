import { NextRequest, NextResponse } from "next/server";
import { CardCollectionData, getCardsBySetID } from "@/components/db/Set";

type Params = Promise<{ setId: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params;
    const setId: string = params.setId;
    const cards: CardCollectionData | undefined = await getCardsBySetID(setId);
    if (!cards) throw new Error(`Cannot get Cards from Set with ID ${setId}`);
    return NextResponse.json(cards, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}