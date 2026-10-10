import HousingLanding from "@features/housing/components/landing/HousingLanding";
import { HOUSING_STRINGS } from "@features/housing/constants/housingStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: HOUSING_STRINGS.meta.title,
  description: HOUSING_STRINGS.meta.description,
};

export default function HousingHubPage() {
  return (
    <div className="flex flex-col">
      <HousingLanding />
      <SmallFooter />
    </div>
  );
}
