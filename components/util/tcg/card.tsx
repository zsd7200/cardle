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
    large: "/back.png"
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
  const url: string =
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

// helper function to get a valid random number
const getRandomNumber = (count: number) => {
  return Math.floor(Math.random() * (count - 1)) + 1;
}

const getCardId = (id: string, count: number) => {
  let rand: number = getRandomNumber(count);
  let prefix: string = '';

  // handle weird sets that have prefixes
  switch (id) {
    case 'dpp':
      prefix += (rand < 10) ? 'DP0' : 'DP';
      break;
    case 'hsp':
      prefix += (rand < 10) ? 'HGSS0' : 'HGSS';
      break;
    case 'bwp':
      prefix += (rand < 10) ? 'BW0' : 'BW';
      break;
    case 'xyp':
      prefix += (rand < 10) ? 'XY0' : 'XY';
      break;
    case 'smp':
      prefix += (rand < 10) ? 'SM0' : 'SM';
      break;
    case 'sma':
      prefix += 'SV';
      break;
    case 'swshp':
      prefix += (rand < 10) 
        ? 'SWSH00' 
        : (rand < 100)
          ? 'SWSH0'
          : 'SWSH';
      break;
    case 'swsh45sv':
      prefix += (rand < 10) 
        ? 'SV00' 
        : (rand < 100)
          ? 'SV0'
          : 'SV';
      break;
    case 'swsh9tg':
    case 'swsh10tg':
    case 'swsh11tg':
    case 'swsh12tg':
      prefix += (rand < 10) ? 'TG0' : 'TG';
      break;
    case 'swsh12pt5gg':
      prefix += (rand < 10) ? 'GG0' : 'GG';
      break;
    case 'ecard2':
    case 'ecard3':
      // these sets have 32 holo cards that don't count toward 
      // the count because they're prefixed with H
      const holoCount: number = 32;
      rand = getRandomNumber(count - holoCount);
      if (rand < holoCount && Math.random() > 0.5) {
        prefix += 'H';
      }
      break;
    case 'col1':
      if (rand >= 96) {
        rand -= 95
        prefix += 'SL';
      }
      break;
    case 'dp7':
      if (rand >= 104) {
        rand -= 103
        prefix += 'SH';
      }
      break;
    case 'pl1':
      if (rand >= 131) {
        rand -= 130
        prefix += 'SH';
      }
      break;
    case 'pl2':
      if (rand >= 115) {
        rand -= 114
        prefix += 'RT';
      }
      break;
    case 'pl3':
      if (rand >= 150) {
        rand -= 149;
        prefix += 'SH';
      }
      break;
    case 'pl4':
      if (rand >= 100) {
        rand -= 99;
        prefix += 'AR';
      }
      break;
    case 'bw11':
      if (rand >= 116) {
        rand -= 115;
        prefix += 'RC';
      }
      break;
    case 'g1':
      if (rand >= 84) {
        rand -= 83;
        prefix += 'RC';
      }
      break;
    default:
      break;
  }

  return prefix + rand;
}

export async function getRandomCard(set: SetData | undefined = undefined) {
  // roll a random set if set isn't passed in
  // or if it's a crazy set that can't just
  // have a random number tacked onto it
  while (!set || set.set_id == 'cel25c' || set.set_id == 'sve') {
    set = await getRandomSet();
  }
  let randomCard: CardProps;
  let cardId: string = `${set.set_id}-${getCardId(set.set_id, set.total)}`;

  // reroll on safer number if above cardId returns a 404
  try {
    randomCard = await getCardById(cardId);
  } catch {
    cardId = `${set.set_id}-${getCardId(set.set_id, set.printedTotal)}`;
    randomCard = await getCardById(cardId);
  }

  return randomCard?.data ?? dummyCard;
}

export async function getMonNamesFromApi() {
  const url: string = getApiUrl();
  const result = await fetchData(url);
  return result;
}