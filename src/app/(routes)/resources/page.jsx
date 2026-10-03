import ResourcesLanding from "@features/resources/components/landing/ResourcesLanding";
import { RESOURCE_STRINGS } from "@features/resources/constants/resourceStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: RESOURCE_STRINGS.meta.title,
  description: RESOURCE_STRINGS.meta.description,
};

export default function ResourcesPage() {
  return (
    <div className="flex flex-col">
      <ResourcesLanding />
      <SmallFooter />
    </div>
  );
}
