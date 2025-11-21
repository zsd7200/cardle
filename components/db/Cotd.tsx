import dbConnect from "@/components/db/Connect";
import COTD from '@/models/Cotd'
import { getRandomCard } from "@/components/util/tcg/CardUtilities";
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
    console.warn('Error populating: ' + err);
  }
}

export async function getCotd(date: string | undefined = undefined) {
  await dbConnect();
  try {
    const currDate = date ?? format(new Date(), 'yyyy-MM-dd');
    let cotd = await COTD.findOne({ date: currDate }).exec();

    if (!cotd) {
      cotd = await populate(date);
    }

    return cotd;
  } catch (err) {
    console.warn('Error getting COTD: ' + err);
  }
}
