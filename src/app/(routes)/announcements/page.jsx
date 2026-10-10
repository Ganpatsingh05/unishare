import AnnouncementsLanding from "@features/announcements/components/landing/AnnouncementsLanding";
import { ANNOUNCEMENT_STRINGS } from "@features/announcements/constants/announcementStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: ANNOUNCEMENT_STRINGS.meta.title,
  description: ANNOUNCEMENT_STRINGS.meta.description,
};

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col">
      <AnnouncementsLanding />
      <SmallFooter />
    </div>
  );
}
