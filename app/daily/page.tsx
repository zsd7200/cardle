// import { getCardById } from "@/components/util/tcg/card";
import Card from "@/components/tcg/card";
// import { getCotd } from "@/components/db/cotd";

export default async function Daily() {
  // temporarily disabled until changes are pushed live to resolve prerendering error on build
  /*
  const cotdData = await getCotd();
  const cardData = await getCardById(cotdData.card_id);

  return (
    <>
      <Card data={cardData} />
    </>
  );
  */

  return (
    <>
      <Card />
    </>
  );
}
