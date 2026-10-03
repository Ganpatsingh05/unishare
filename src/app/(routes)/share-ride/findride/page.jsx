import FindRides from "@features/rides/components/find/FindRides";
import { RIDE_STRINGS } from "@features/rides/constants/rideStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: RIDE_STRINGS.find.meta.title,
  description: RIDE_STRINGS.find.meta.description,
};

export default function FindRidePage() {
  return (
    <div className="flex flex-col">
      <FindRides />
      <SmallFooter />
    </div>
  );
}
