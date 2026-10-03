import ManageRides from "@features/rides/components/manage/ManageRides";
import { RIDE_STRINGS } from "@features/rides/constants/rideStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: RIDE_STRINGS.my.meta.title,
  description: RIDE_STRINGS.my.meta.description,
};

export default function ManageRidesPage() {
  return (
    <div className="flex flex-col">
      <ManageRides />
      <SmallFooter />
    </div>
  );
}
