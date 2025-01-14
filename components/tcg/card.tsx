import fetchData from "@/components/util/fetch-data";
import { getRandomSetId } from "@/components/tcg/set";
import { PokemonCollectionData, getMonNames } from "@/components/db/pokemon";

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

type CardsData = {
  data: Array<InnerCardData>,
  page: number,
  pageSize: number,
  count: number,
  totalCount: number,
}

type CardProps = {
  data?: InnerCardData
}

async function getCardsBySet(setId: string) {
  const url: string = `https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`;
  const result: CardsData = await fetchData(url);
  return result;
}

export async function getCardById(cardId: string) {
  const url: string = `https://api.pokemontcg.io/v2/cards/${cardId}`;
  const result: CardProps = await fetchData(url);
  return result;
}

export async function getRandomCard(setId: string | undefined = undefined) {
  setId = setId ?? await getRandomSetId();
  const cards: CardsData = await getCardsBySet(setId);
  const randomCard: InnerCardData = cards.data[Math.floor(Math.random() * cards.data.length)];
  return randomCard;
}

export async function Card(props: CardProps | undefined = undefined) {
  const cardData = props?.data ?? await getRandomCard();
  const monNames: Array<string> = await getMonNames();
  
  return (
    <>
      <div className="flex justify-center items-center gap-[50px]">
        <div className="overflow-hidden">
          <div className="overflow-hidden max-h-[700px] w-fit">
            <img src={cardData.images.large ?? cardData.images.small} className="blur-3xl h-[700px] pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col w-1/3 text-lg rounded-lg px-[15px] py-[10px] shadow-[0px_0px_13px_8px_rgba(128,_128,_128,_0.1)] bg-gray-700">
          <div className="flex flex-col pb-[15px]">
            <div className="flex justify-between">
              <span>Classification:</span>
              <span>{cardData.supertype}</span>
            </div>
            <div className="flex justify-between">
              <span>Subclasses:</span>
              <div>
                {cardData.subtypes.map((type: string, i: number) => (
                  <span key={type}>{ (i && (type.trim().length > 1) ? ', ' : '' + type) }</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Set:</span>
              <span>{cardData.set.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Rarity:</span>
              <span>{cardData.rarity}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <form>
              <input list="mons" name="mons" className="text-black"></input>
              <datalist id="mons">
                {monNames.map(name => (
                  <option key={name} value={name}></option>
                ))}
              </datalist>
            </form>
            <div>
              <span>Guesses Left: </span>
              <span>3</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}