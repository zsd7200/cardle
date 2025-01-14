import fetchData from "@/components/util/fetch-data";

type InnerSetData = {
  id: string,
  name: string,
  series: string,
  printedTotal: number,
  total: number,
  legalities: {
    unlimited: string,
    standard?: string,
    expanded?: string,
  },
  ptcgoCode: string,
  releaseData: string,
  updatedAt: string,
  images: {
    symbol: string,
    logo: string,
  },
}

type SetData = {
  data: InnerSetData,
}

type SetsData = {
  data: Array<InnerSetData>,
  page: number,
  pageSize: number,
  count: number,
  totalCount: number,
}

export async function getAllSets() {
  const url: string = `https://api.pokemontcg.io/v2/sets/`;
  const result: SetsData = await fetchData(url);
  return result;
}

export async function getRandomSet() {
  const sets: SetsData = await getAllSets();
  const randomSet: InnerSetData = sets.data[Math.floor(Math.random() * sets.data.length)];
  return randomSet;
}

export async function getRandomSetId() {
  const randomSet: InnerSetData = await getRandomSet();
  return randomSet.id;
}