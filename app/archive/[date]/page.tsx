import { getCardById } from "@/components/util/tcg/card";
import Card from "@/components/tcg/card";
import { getCotd } from "@/components/db/cotd";
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

type Params = Promise<{ date: string }>;

export default async function ArchiveDate(props: { params: Params }) {
  const params =  await props.params;
  const date = params.date;
  const dateArr: Array<string> = date.split('-');
  if (date.length !== 10 || dateArr.length !== 3 || parseInt(dateArr[0]) < 2025) {
    return (
      <>
        <p>Invalid date.</p>
      </>
    );
  }
  const dateParam = new Date(parseInt(dateArr[0]), parseInt(dateArr[1]) - 1, parseInt(dateArr[2]));
  const currDate = new Date();

  if (dateParam > currDate) {
    return (
      <>
        <p>Date is in the future.</p>
      </>
    );
  }

  if (date == format(currDate, 'yyyy-MM-dd')) {
    return redirect('/daily');
  }

  const cotdData = await getCotd(date);
  const cardData = await getCardById(cotdData.card_id);

  return (
    <>
      <Card data={cardData} />
    </>
  );
}
