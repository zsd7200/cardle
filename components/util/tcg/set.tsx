import fetchData from "@/components/util/fetch-data";

export type SetData = {
  set_id: string,
  name: string,
  total: number,
}

async function getAllSetsFromApi() {
  const url: string = `/api/sets`;
  const result: Array<SetData> = await fetchData(url);
  return result;
}

export async function getRandomSet() {
  const sets: Array<SetData> = await getAllSetsFromApi();
  const randomSet: SetData = sets[Math.floor(Math.random() * sets.length)];
  return randomSet;
}