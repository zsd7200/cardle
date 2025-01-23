import dbConnect from "@/components/db/connect";
import Set from "@/models/set";
import fetchData from "@/components/util/fetch-data";
import { Types } from 'mongoose';
import { InnerCardData } from '@/components/util/tcg/card';

type SetIdCollectionData = {
  _id: Types.ObjectId,
  set_id: string,
  total: number,
  printedTotal: number,
  updated?: Date,
}

type InnerPokemonTcgApiData = {
  id: string,
  name: string,
  total: number,
  printedTotal: number,
}

type PokemonTcgApiSetData = {
  data: Array<InnerPokemonTcgApiData>,
  count: number,
}

type PokemonTcgApiCardData = {
  data: Array<InnerCardData>,
  count: number,
}

export type CardCollectionData = {
  _id: Types.ObjectId,
  data: Array<InnerCardData>,
}

async function getCount() {
  const url: string = `https://api.pokemontcg.io/v2/sets/`;
  const data: PokemonTcgApiSetData = await fetchData(url);
  return data.count;
}

async function populate() {
  await dbConnect();

  // wait helper function rather than wrapping whole for loop in setTimeout
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const formatCardData = (data: Array<InnerCardData>) => {
    const newData: Array<InnerCardData> = [];

    for (let i = 0; i < data.length; i++) {
      const cardData: InnerCardData = {
        id: data[i].id,
        name: data[i].name,
        supertype: data[i].supertype,
        subtypes: data[i].subtypes,
        hp: data[i].hp,
        types: data[i].types,
        set: {
          id: data[i].set.id,
          name: data[i].set.name,
        },
        number: data[i].number,
        rarity: data[i].rarity,
        images: data[i].images,
      }
      
      newData.push(cardData);
    }

    return newData;
  };

  try {
    const url: string = `https://api.pokemontcg.io/v2/sets/`;
    const data: PokemonTcgApiSetData = await fetchData(url);
    
    // was a foreach, but wanted to space out timing since
    // this loop includes api calls
    for (let i = 0; i < data.data.length; i++) {
      const set = data.data[i];
      const foundSet = await Set.findOne({ set_id: set.id }).exec();
      if (foundSet && foundSet?.data) {
        console.log(`Set with ID "${set.id}" already exists with proper data. Skipping...`);
        continue;
      };

      const cardUrl: string = `https://api.pokemontcg.io/v2/cards/?q=set.id:${set.id}`;
      const cardData: PokemonTcgApiCardData = await fetchData(cardUrl);
      const formattedData = formatCardData(cardData.data);
      const modelData = {
        set_id: set.id,
        name: set.name,
        total: set.total,
        printedTotal: set.printedTotal,
        data: formattedData,
      };

      console.log(`${(foundSet) ? 'Updating' : 'Inserting' } Set with ID "${set.id}"...`);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (foundSet) 
        ? await Set.findOneAndUpdate({ set_id: set.id }, { data: formattedData })
        : await Set.create(modelData);
      console.log(`${(foundSet) ? 'Updated' : 'Inserted' }, waiting 5s to continue...`);
      await wait(5000);
    }
  } catch (err) {
    console.log('Error populating: ' + err);
  }
}

export async function getCardsBySetID(set_id: string) {
  await dbConnect();
  try {
    const cardCollection: Array<CardCollectionData> = await Set.find({ set_id: set_id }, 'data').exec();
    return cardCollection;
  } catch (err) {
    console.log('Error getting Card collection: ' + err);
  }

  return [];
}

export async function getSetIDs() {
  await dbConnect();
  try {
    const setIdCollection: Array<SetIdCollectionData> = await Set.find({}, '_id set_id total printedTotal updated').exec();
    const lastSet: SetIdCollectionData = setIdCollection[setIdCollection.length - 1];

    if (lastSet && lastSet.updated) {
      const lastDate: Date = new Date(lastSet.updated);
      const currDate: Date = new Date();
      const dateDiff: number = currDate.valueOf() - lastDate.valueOf();
      const UPDATE_TIMEOUT_MS: number = 2592000000; // 30 days in MS

      if (dateDiff < UPDATE_TIMEOUT_MS) {
        return setIdCollection; // return early if 30 days has not passed since last update
      }

      // update lastSet to have new last checked date
      Set.findOneAndUpdate({ _id: lastSet._id }, { updated: new Date().toISOString() });
    }

    // only poll pokeapi if 30 days has passed and if count has changed
    const count = await getCount();
    if (!lastSet || setIdCollection.length < count) {
      await populate();
      const updatedIdCollection: Array<SetIdCollectionData> = await Set.find({}, '_id set_id updated').exec();
      return updatedIdCollection;
    }

    return setIdCollection;
  } catch (err) {
    console.log('Error getting Set IDs collection: ' + err);
  }

  return [];
}