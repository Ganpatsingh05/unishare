import PostRoom from "@features/housing/components/post/PostRoom";
import { HOUSING_STRINGS } from "@features/housing/constants/housingStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: HOUSING_STRINGS.post.meta.title,
  description: HOUSING_STRINGS.post.meta.description,
};

export default function PostRoomPage() {
  return (
    <div className="flex flex-col">
      <PostRoom />
      <SmallFooter />
    </div>
  );
}
