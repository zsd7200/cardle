import dbConnect from "@/components/db/connect";
import COTD from "@/models/COTD";
import { getRandomCard } from "@/components/tcg/card";
import { format } from 'date-fns';

async function populate(date: string | undefined = undefined) {
  await dbConnect();
  try {
    const currDate = date ?? format(new Date(), 'yyyy-MM-dd');
    const card = await getRandomCard();
    const modelData = {
      card_id: card.id,
      set_id: card.set.id,
      date: currDate,
    };
    console.log(modelData);
    const cotd = await COTD.create(modelData);
    return cotd;
  } catch (err) {
    console.log('Error populating: ' + err);
  }
}

export async function getCotd(date: string | undefined = undefined) {
  await dbConnect();
  try {
    const currDate = date ?? format(new Date(), 'yyyy-MM-dd');
    console.log();
    let cotd = await COTD.findOne({ date: currDate }).exec();

    if (!cotd) {
      cotd = await populate(date);
    }

    return cotd;
  } catch (err) {
    console.log('Error getting COTD: ' + err);
  }
}