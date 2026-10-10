import ManageAnnouncements from "@features/announcements/components/manage/ManageAnnouncements";
import { ANNOUNCEMENT_STRINGS } from "@features/announcements/constants/announcementStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: ANNOUNCEMENT_STRINGS.manage.meta.title,
  description: ANNOUNCEMENT_STRINGS.manage.meta.description,
};

export default function ManageAnnouncementsPage() {
  return (
    <div className="flex flex-col">
      <ManageAnnouncements />
      <SmallFooter />
    </div>
  );
}
