import fetchData from "@/components/util/fetch-data";
import { SetData, getRandomSet } from "@/components/util/tcg/set";

export type InnerCardData = {
  id: string,
  name: string,
  supertype: string,
  subtypes: string[],
  hp: string,
  types: string[],
  set: {
    id: string,
    name: string,
    releaseDate: string,
    images: {
      symbol: string,
      logo: string,
    },
  },
  number: string,
  rarity: string,
  images: {
    small: string,
    large: string,
  },
  tcgplayer: {
    url: string,
    updatedAt: string,
    prices: object,
  },
};

export const dummyCard: InnerCardData = {
  id: "?????",
  name: "?????",
  supertype: "?????",
  subtypes: [
    "?????"
  ],
  hp: "?????",
  types: [
    "?????"
  ],
  set: {
    id: "?????",
    name: "?????",
    releaseDate: "?????",
    images: {
      symbol: "https://images.pokemontcg.io/base1/symbol.png",
      logo: "https://images.pokemontcg.io/base1/logo.png"
    }
  },
  number: "?????",
  rarity: "?????",
  images: {
    small: "https://images.pokemontcg.io/base1/4.png",
    large: "https://images.pokemontcg.io/base1/4_hires.png"
  },
  tcgplayer: {
    url: "?????",
    updatedAt: "?????",
    prices: {},
  },
}

type CardProps = {
  data?: InnerCardData
}

const getApiUrl = () => {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/names'
      : 'https://www.cardle.wtf/api/names';

  return url;
}

export async function getCardById(cardId: string) {
  const url: string = `https://api.pokemontcg.io/v2/cards/${cardId}`;
  const result: CardProps = await fetchData(url);
  return result;
}

export async function getRandomCard(set: SetData | undefined = undefined) {
  set = set ?? await getRandomSet();
  let randomCard: CardProps;
  let cardId = `${set.set_id}-${Math.floor(Math.random() * set.total - 1) + 1}`

  // reroll on safer number if above cardId returns a 404
  try {
    randomCard = await getCardById(cardId);
  } catch {
    cardId = `${set.set_id}-${Math.floor(Math.random() * set.printedTotal - 1) + 1}`
    randomCard = await getCardById(cardId);
  }

  return randomCard?.data ?? dummyCard;
}

export async function getMonNamesFromApi() {
  const url: string = getApiUrl();
  const result = await fetchData(url);
  return result;
}