import { getCardById, Card } from "@/components/tcg/card";
import { getCotd } from "@/components/db/cotd";

export default async function Daily() {
  const cotdData = await getCotd();
  const cardData = await getCardById(cotdData.card_id);

  return (
    <>
      <Card {...cardData} />
    </>
  );
}
