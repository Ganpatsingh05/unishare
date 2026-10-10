import SuggestResource from "@features/resources/components/suggest/SuggestResource";
import { RESOURCE_STRINGS } from "@features/resources/constants/resourceStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: RESOURCE_STRINGS.suggest.meta.title,
  description: RESOURCE_STRINGS.suggest.meta.description,
};

export default function SuggestResourcePage() {
  return (
    <div className="flex flex-col">
      <SuggestResource />
      <SmallFooter />
    </div>
  );
}
