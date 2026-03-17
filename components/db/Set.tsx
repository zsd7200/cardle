import dbConnect from "@/components/db/Connect";
import Set from "@/models/Set";
import fetchData from "@/components/util/FetchData";
import { Types } from 'mongoose';
import { RawCardBriefData } from '@/components/util/tcg/CardUtilities';

type SetIdCollectionData = {
  _id: Types.ObjectId,
  set_id: string,
  cardCount: {
    total: number,
    official: number,
  },
  updated?: Date,
}

type InnerTcgDexApiData = {
  id: string,
  name: string,
  cardCount: {
    total: number,
    official: number,
  },
}

type TcgDexApiCardData = {
  cardCount: {
    firstEd: number,
    holo: number,
    normal: number,
    official: number,
    reverse: number,
    total: number,
  },
  cards: Array<RawCardBriefData>,
}

export type CardCollectionData = {
  _id: Types.ObjectId,
  data: Array<RawCardBriefData>,
}

async function getCount() {
  const url: string = `https://api.tcgdex.net/v2/en/sets/`;
  const data: Array<InnerTcgDexApiData> = await fetchData(url);
  return data.length;
}

async function populate() {
  await dbConnect();

  // wait helper function rather than wrapping whole for loop in setTimeout
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    const url: string = `https://api.tcgdex.net/v2/en/sets/`;
    const data: Array<InnerTcgDexApiData> = await fetchData(url);
    
    // was a foreach, but wanted to space out timing since
    // this loop includes api calls
    for (let i = 0; i < data.length; i++) {
      const set = data[i];
      const foundSet = await Set.findOne({ set_id: set.id }).exec();
      if (foundSet && foundSet?.data) {
        console.log(`Set with ID "${set.id}" already exists with proper data. Skipping...`);
        continue;
      };

      const setUrl: string = `https://api.tcgdex.net/v2/en/sets/${set.id}`;
      const setData: TcgDexApiCardData = await fetchData(setUrl);
      const modelData = {
        set_id: set.id,
        name: set.name,
        cardCount: {
          total: set.cardCount.total,
          official: set.cardCount.official,
        },
        data: setData.cards,
      };

      console.log(`${(foundSet) ? 'Updating' : 'Inserting' } Set with ID "${set.id}"...`);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (foundSet) 
        ? await Set.findOneAndUpdate({ set_id: set.id }, { data: setData.cards })
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
    const cardCollection: CardCollectionData = await Set.findOne({ set_id: set_id }, 'data').exec();
    return cardCollection;
  } catch (err) {
    console.log('Error getting Card collection: ' + err);
  }

  return undefined;
}

export async function getSetIDs() {
  await dbConnect();

  try {
    const setIdCollection: Array<SetIdCollectionData> = await Set.find({}, '_id set_id updated').exec();
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

    // only poll api if 30 days has passed and if count has changed
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
