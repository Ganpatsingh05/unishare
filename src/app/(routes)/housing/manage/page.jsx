import ManageRooms from "@features/housing/components/manage/ManageRooms";
import { HOUSING_STRINGS } from "@features/housing/constants/housingStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: HOUSING_STRINGS.manage.meta.title,
  description: HOUSING_STRINGS.manage.meta.description,
};

export default function ManageRoomsPage() {
  return (
    <div className="flex flex-col">
      <ManageRooms />
      <SmallFooter />
    </div>
  );
}
