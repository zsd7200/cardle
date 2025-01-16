import { getCardById } from "@/components/util/tcg/card";
import Card from "@/components/tcg/card";
import { getCotd } from "@/components/db/cotd";

export const revalidate = 3600;

export default async function Daily() {
  const cotdData = await getCotd();
  const cardData = await getCardById(cotdData.card_id);

  return (
    <>
      <Card {...cardData} />
    </>
  );
}
