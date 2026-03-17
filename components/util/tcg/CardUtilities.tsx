import fetchData from "@/components/util/FetchData";
import { SetData, getRandomSet } from "@/components/util/tcg/SetUtilities";

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
  // or if it's a crazy set that can't just
  // have a random number tacked onto it
  while (!set || set.set_id == 'cel25c' || set.set_id == 'sve') {
    set = await getRandomSet();
    if (!set.data || set.data.length == 0) {
      set = undefined;
    }
  }

  const cardId: string = set.data[Math.floor(Math.random() * set.data.length)].id;
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