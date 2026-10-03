import ManageResources from "@features/resources/components/manage/ManageResources";
import { RESOURCE_STRINGS } from "@features/resources/constants/resourceStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: RESOURCE_STRINGS.manage.meta.title,
  description: RESOURCE_STRINGS.manage.meta.description,
};

export default function ManageResourcesPage() {
  return (
    <div className="flex flex-col">
      <ManageResources />
      <SmallFooter />
    </div>
  );
}
