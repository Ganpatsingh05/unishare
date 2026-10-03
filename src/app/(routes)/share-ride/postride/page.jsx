import PostRide from "@features/rides/components/post/PostRide";
import { RIDE_STRINGS } from "@features/rides/constants/rideStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: RIDE_STRINGS.post.meta.title,
  description: RIDE_STRINGS.post.meta.description,
};

export default function PostRidePage() {
  return (
    <div className="flex flex-col">
      <PostRide />
      <SmallFooter />
    </div>
  );
}
