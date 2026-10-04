import BuyLanding from "@features/marketplace/components/BuyLanding";
import { MARKET_STRINGS } from "@features/marketplace/constants/marketStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: MARKET_STRINGS.meta.title,
  description: MARKET_STRINGS.meta.description,
};

export default function BuyPage() {
  return (
    <div className="flex flex-col">
      <BuyLanding />
      <SmallFooter />
    </div>
  );
}
