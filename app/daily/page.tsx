import { getCardById } from "@/components/util/tcg/CardUtilities";
import Card from "@/components/tcg/CardGame";
import { getCotd } from "@/components/db/Cotd";

export default async function Daily() {
  const cotdData = await getCotd();
  const cardData = await getCardById(cotdData.card_id);

  return (
    <>
      <Card data={cardData} />
    </>
  );
}
