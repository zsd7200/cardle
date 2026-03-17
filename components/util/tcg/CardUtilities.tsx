import fetchData from "@/components/util/FetchData";
import { SetData, getRandomSet, getCardsBySetIdFromApi } from "@/components/util/tcg/SetUtilities";

export type RawCardBriefData = {
  id: string,
  image?: string,
  localId: string,
  name: string,
};

export type CardData = {
  id: string,
  localId: string,
  name: string,
  images: {
    high: string | undefined,
    low: string | undefined,
  },
  category: string,
  illustrator?: string,
  rarity?: string,
  setInfo: {
    id: string,
    name: string,
  },
}

export const dummyCard: CardData = {
  id: "?????",
  localId: "?????",
  name: "?????",
  images: {
    high: "/back.png",
    low: "/back.png",
  },
  category: "?????",
  illustrator: "?????",
  rarity: "?????",
  setInfo: {
    id: "?????",
    name: "?????",
  },
}

const getNamesApiUrl = () => {
  const url: string =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/names'
      : 'https://www.cardle.wtf/api/names';

  return url;
}

const getCardIdApiUrl = (cardId: string) => {
  const url: string =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/api/card/${cardId}`
      : `https://www.cardle.wtf/api/card/${cardId}`;

  return url;
}

export async function getCardById(cardId: string) {
  const url: string = getCardIdApiUrl(cardId);
  const result: CardData = await fetchData(url);
  return result;
}

export async function getRandomCard(set: SetData | undefined = undefined) {
  // roll a random set if set isn't passed in
  if (!set) {
    set = await getRandomSet();
  }

  const setCardIds = await getCardsBySetIdFromApi(set.set_id);
  if (setCardIds.length === 0) {
    return getRandomCard();
  }

  const cardId: string = setCardIds[Math.floor(Math.random() * setCardIds.length)].id;
  const randomCard: CardData = await getCardById(cardId);

  if (!randomCard.images.high && !randomCard.images.low) {
    return getRandomCard(set);
  }

  return randomCard ?? dummyCard;
}

export async function getMonNamesFromApi() {
  const url: string = getNamesApiUrl();
  const result = await fetchData(url);
  return result;
}