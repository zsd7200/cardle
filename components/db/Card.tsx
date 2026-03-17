import dbConnect from "@/components/db/Connect";
import Card from "@/models/Card";
import fetchData from "@/components/util/FetchData";
import { CardData } from '@/components/util/tcg/CardUtilities';

type RawSetBrief = {
  id: string,
  name: string,
  logo?: string,
  symbol?: string,
  cardCount: {
    total: number,
    official: number,
  },
};

type RawBooster = {
  id: string,
  name: string,
  logo?: string,
  artwork_front?: string,
  artwork_back?: string,
}

type RawCardData = {
  id: string,
  localId: string,
  name: string,
  image?: string,
  category: string,
  illustrator?: string,
  rarity?: string,
  set: RawSetBrief,
  variants: {
    normal: boolean,
    reverse: boolean,
    holo: boolean,
    firstEdition: boolean,
  },
  boosters?: Array<RawBooster>,
  updated: string,
}

async function populate(cardId: string) {
  await dbConnect();

  const formatCardData = (rawData: RawCardData) => {
    const formattedData: CardData = {
      id: rawData.id,
      localId: rawData.localId,
      name: rawData.name,
      images: {
        high: (rawData.image) ? `${rawData.image}/high.webp` : undefined,
        low: (rawData.image) ? `${rawData.image}/low.webp` : undefined,
      },
      category: rawData.category,
      illustrator: rawData.illustrator,
      rarity: rawData.rarity,
      setInfo: {
        id: rawData.set.id,
        name: rawData.set.name,
      },
    }

    return formattedData;
  };

  try {
    const url: string = `https://api.tcgdex.net/v2/en/cards/${cardId}`;
    const data: RawCardData = await fetchData(url);
    const formattedData: CardData = formatCardData(data);
    const card = await Card.create(formattedData);
    return card;
  } catch (err) {
    console.log('Error populating: ' + err);
  }
}

export async function getCardById(cardId: string) {
  await dbConnect();
  try {
    let card = await Card.findOne({ id: cardId }, 'id name images category illustrator rarity setInfo').exec();
    if (!card) {
      card = populate(cardId);
    }
    return card;
  } catch (err) {
    console.log('Error getting Card: ' + err);
  }

  return [];
}
