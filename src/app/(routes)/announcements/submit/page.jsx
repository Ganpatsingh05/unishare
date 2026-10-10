import PostAnnouncement from "@features/announcements/components/post/PostAnnouncement";
import { ANNOUNCEMENT_STRINGS } from "@features/announcements/constants/announcementStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: ANNOUNCEMENT_STRINGS.post.meta.title,
  description: ANNOUNCEMENT_STRINGS.post.meta.description,
};

export default function SubmitAnnouncementPage() {
  return (
    <div className="flex flex-col">
      <PostAnnouncement />
      <SmallFooter />
    </div>
  );
}
