import dbConnect from "@/components/db/connect";
import COTD from "@/models/COTD";
import { getRandomCard } from "../tcg/card";

async function populate(date: Date | undefined = undefined) {
  await dbConnect();
  try {
    const currDate = date ?? new Date(Date.now()).toISOString().split('T')[0];
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

export async function getCotd() {
  await dbConnect();
  try {
    const currDate = new Date(Date.now()).toISOString().split('T')[0];
    let cotd = await COTD.findOne({ date: currDate }).exec();

    if (!cotd) {
      cotd = await populate();
    }

    return cotd;
  } catch (err) {
    console.log('Error getting COTD: ' + err);
  }
}