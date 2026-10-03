import HousingSearch from "@features/housing/components/search/HousingSearch";
import { HOUSING_STRINGS } from "@features/housing/constants/housingStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: HOUSING_STRINGS.search.meta.title,
  description: HOUSING_STRINGS.search.meta.description,
};

export default function HousingSearchPage() {
  return (
    <div className="flex flex-col">
      <HousingSearch />
      <SmallFooter />
    </div>
  );
}
