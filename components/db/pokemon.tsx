import dbConnect from "@/components/db/connect";
import Pokemon from "@/models/pokemon";
import fetchData from "@/components/util/fetch-data";

export type PokemonCollectionData = {
  id: number,
  name: string,
  api_url: string,
  created?: Date,
  updated?: Date,
}

type InnerPokeApiData = {
  name: string,
  url: string,
}

type PokeApiData = {
  count: number,
  next: string | null,
  previous: string | null,
  results: Array<InnerPokeApiData>,
}

async function getCount() {
  const url: string = `https://pokeapi.co/api/v2/pokemon/?limit=1`;
  const data: PokeApiData = await fetchData(url);
  return data.count;
}

async function populate(date: Date | undefined = undefined) {
  await dbConnect();
  try {
    const url: string = `https://pokeapi.co/api/v2/pokemon/?limit=5000`;
    const data: PokeApiData = await fetchData(url);
    
    data.results.forEach(async (mon: InnerPokeApiData) => {
      const modelData = {
        name: mon.name,
        api_url: mon.url,
      };
      console.log(modelData);
      await Pokemon.create(modelData);
    });
  } catch (err) {
    console.log('Error populating: ' + err);
  }
}

export async function getMonCollection() {
  await dbConnect();
  try {
    const monCollection: Array<PokemonCollectionData> = await Pokemon.find().sort('id').exec();
    const lastMon: PokemonCollectionData = monCollection[monCollection.length - 1];

    if (lastMon && lastMon.updated) {
      const lastDate: Date = new Date(lastMon.updated);
      const currDate: Date = new Date();
      const dateDiff: number = currDate.valueOf() - lastDate.valueOf();
      const UPDATE_TIMEOUT_MS: number = 2592000000; // 30 days in MS

      if (dateDiff < UPDATE_TIMEOUT_MS) {
        return monCollection; // return early if 30 days has not passed since last update
      }

      // update lastMon to have new last checked date
      Pokemon.findOneAndUpdate({ id: lastMon.id }, { updated: new Date().toISOString() });
    }

    // only poll pokeapi if 30 days has passed and if count has changed
    const count = await getCount();
    if (!lastMon || lastMon.id < count) {
      await populate();
      const updatedCollection: Array<PokemonCollectionData> = await Pokemon.find().exec();
      return updatedCollection;
    }

    return monCollection;
  } catch (err) {
    console.log('Error getting Pokemon collection: ' + err);
  }
}

export async function getMonNames() {
  const monNames: Array<string> = [];
  const monCollection: Array<PokemonCollectionData> = await getMonCollection() as Array<PokemonCollectionData>;

  monCollection.forEach((mon) => {
    const splitName: Array<string> = mon.name.split('-');
    let name = splitName[0][0].toUpperCase() + splitName[0].substr(1);

    if (splitName.length > 1) {
      for (let i = 1; i < splitName.length; i++) {
        name += '-'
        name += splitName[i][0].toUpperCase() + splitName[i].substr(1);
      }
    }
    monNames.push(name);
  });

  monNames.sort();
  return [...new Set(monNames)]; // removes duplicates
}