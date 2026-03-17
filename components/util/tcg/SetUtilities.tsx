import fetchData from "@/components/util/FetchData";
import { RawCardBriefData } from "@/components/util/tcg/CardUtilities";

export type SetData = {
  set_id: string,
  name: string,
  cardCount: {
    total: number,
    official: number,
  },
  data: Array<RawCardBriefData>,
}

const getApiUrl = () => {
  const url: string =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/sets'
      : 'https://www.cardle.wtf/api/sets';

  return url;
}

async function getAllSetsFromApi() {
  const url: string = getApiUrl();
  const result: Array<SetData> = await fetchData(url);
  return result;
}

export async function getRandomSet() {
  const sets: Array<SetData> = await getAllSetsFromApi();
  const randomSet: SetData = sets[Math.floor(Math.random() * sets.length)];
  return randomSet;
}