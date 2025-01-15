import dbConnect from "@/components/db/connect";
import Set from "@/models/set";
import fetchData from "@/components/util/fetch-data";

type SetCollectionData = {
  id: number,
  set_id: string,
  name: string,
  total: number,
  created?: Date,
  updated?: Date,
}

type InnerPokemonTcgApiData = {
  id: string,
  name: string,
  total: number,
}

type PokemonTcgApiData = {
  data: Array<InnerPokemonTcgApiData>,
  count: number,
}

async function getCount() {
  const url: string = `https://api.pokemontcg.io/v2/sets/`;
  const data: PokemonTcgApiData = await fetchData(url);
  return data.count;
}

async function populate() {
  await dbConnect();
  try {
    const url: string = `https://api.pokemontcg.io/v2/sets/`;
    const data: PokemonTcgApiData = await fetchData(url);
    
    data.data.forEach(async (set: InnerPokemonTcgApiData) => {
      const modelData = {
        set_id: set.id,
        name: set.name,
        total: set.total,
      };
      console.log(modelData);
      await Set.create(modelData);
    });
  } catch (err) {
    console.log('Error populating: ' + err);
  }
}

export default async function getSetCollection() {
  await dbConnect();
  try {
    const setCollection: Array<SetCollectionData> = await Set.find().exec();
    const lastSet: SetCollectionData = setCollection[setCollection.length - 1];

    if (lastSet && lastSet.updated) {
      const lastDate: Date = new Date(lastSet.updated);
      const currDate: Date = new Date();
      const dateDiff: number = currDate.valueOf() - lastDate.valueOf();
      const UPDATE_TIMEOUT_MS: number = 2592000000; // 30 days in MS

      if (dateDiff < UPDATE_TIMEOUT_MS) {
        return setCollection; // return early if 30 days has not passed since last update
      }

      // update lastMon to have new last checked date
      Set.findOneAndUpdate({ id: lastSet.id }, { updated: new Date().toISOString() });
    }

    // only poll pokeapi if 30 days has passed and if count has changed
    const count = await getCount();
    if (!lastSet || setCollection.length < count) {
      await populate();
      const updatedCollection: Array<SetCollectionData> = await Set.find().exec();
      return updatedCollection;
    }

    return setCollection;
  } catch (err) {
    console.log('Error getting Set collection: ' + err);
  }
}