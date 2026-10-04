import ItemDetail from "@features/marketplace/components/ItemDetail";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Item | UniShare Marketplace",
  description: "Photos, price, condition and pickup details for an item on the UniShare marketplace.",
};

export default async function ItemPage({ params }) {
  const { itemId } = await params;
  return (
    <div className="flex flex-col">
      <ItemDetail itemId={itemId} />
      <SmallFooter />
    </div>
  );
}
