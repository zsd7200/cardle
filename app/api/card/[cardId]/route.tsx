import { NextRequest, NextResponse } from "next/server";
import { getCardById } from "@/components/db/Card";
import { CardData } from "@/components/util/tcg/CardUtilities";

type Params = Promise<{ cardId: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params;
    const cardId: string = params.cardId;
    const card: CardData | undefined = await getCardById(cardId);
    if (!card) throw new Error(`Cannot get Card with ID ${cardId}`);
    return NextResponse.json(card, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}