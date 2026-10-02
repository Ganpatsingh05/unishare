import RideLanding from "@features/rides/components/landing/RideLanding";
import { RIDE_STRINGS } from "@features/rides/constants/rideStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: RIDE_STRINGS.meta.title,
  description: RIDE_STRINGS.meta.description,
};

export default function ShareRideHubPage() {
  return (
    <div className="flex flex-col">
      <RideLanding />
      <SmallFooter />
    </div>
  );
}
