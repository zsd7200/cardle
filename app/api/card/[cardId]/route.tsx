import { NextRequest, NextResponse } from "next/server";
import { CardCollectionData, getCardsBySetID } from "@/components/db/set";

type Params = Promise<{ cardId: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  try {
    const params = await props.params;
    const cardId: string = params.cardId;
    const setId: string = cardId.split('-')[0];
    const cardsArr: Array<CardCollectionData> = await getCardsBySetID(setId);
    if (!cardsArr || cardsArr.length !== 1) throw new Error(`Cannot get Cards from Set with ID: ${setId}`);

    const card = cardsArr[0].data.find((el) => el.id == cardId);
    return NextResponse.json(card, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}