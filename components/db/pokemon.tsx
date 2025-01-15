import dbConnect from "@/components/db/connect";
import Pokemon from "@/models/pokemon";
import fetchData from "@/components/util/fetch-data";

type PokemonCollectionData = {
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

async function populate() {
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

async function getMonCollection() {
  await dbConnect();
  try {
    const monCollection: Array<PokemonCollectionData> = await Pokemon.find().exec();
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
    if (!lastMon || monCollection.length < count) {
      await populate();
      const updatedCollection: Array<PokemonCollectionData> = await Pokemon.find().exec();
      return updatedCollection;
    }

    return monCollection;
  } catch (err) {
    console.log('Error getting Pokemon collection: ' + err);
  }
}

const shouldFilterName = (nameArr: Array<string>) => {
  if (nameArr.length == 2) {
    if (
      // regional forms
      nameArr[1] == 'alola' ||
      nameArr[1] == 'galar' ||
      nameArr[1] == 'hisui' ||
      nameArr[1] == 'paldea' ||

      // paradox mons and treasures of ruin
      nameArr[1] == 'tusk' ||
      nameArr[1] == 'tail' ||
      nameArr[1] == 'bonnet' ||
      nameArr[1] == 'mane' ||
      nameArr[1] == 'wing' ||
      nameArr[1] == 'shocks' ||
      nameArr[0] == 'iron' ||
      nameArr[1] == 'chien' ||
      nameArr[1] == 'pao' ||
      nameArr[1] == 'lu' ||
      nameArr[1] == 'yu' ||
      nameArr[1] == 'moon' ||
      nameArr[1] == 'wake' ||
      nameArr[1] == 'fire' ||
      nameArr[1] == 'bolt'
    ) {
      return false;
    }
    
  }

  return true;
}

export default async function getMonNames() {
  try {
    const monNames: Array<string> = [];
    const monCollection: Array<PokemonCollectionData> = await getMonCollection() as Array<PokemonCollectionData>;
  
    monCollection.forEach((mon) => {
      const splitName: Array<string> = mon.name.split('-');
      let name = splitName[0][0].toUpperCase() + splitName[0].substr(1);

      if (splitName.length > 1) {
        if (!shouldFilterName(splitName)) {
          for (let i = 1; i < splitName.length; i++) {
            name += '-' + splitName[i][0].toUpperCase() + splitName[i].substr(1);
          }
        }
      }
      monNames.push(name);
    });

    monNames.sort();
    return [...new Set(monNames)]; // removes duplicates
  } catch (err) {
    console.log(err);
    return [];
  }
}