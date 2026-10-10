import ProfilePage from "@features/profile/components/ProfilePage";
import { PROFILE_STRINGS } from "@features/profile/constants/profileStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: PROFILE_STRINGS.meta.title,
  description: PROFILE_STRINGS.meta.description,
};

export default function Profile() {
  return (
    <div className="flex flex-col">
      <ProfilePage />
      <SmallFooter />
    </div>
  );
}
