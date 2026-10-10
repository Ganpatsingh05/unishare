import LostFoundLanding from "@features/lost-found/components/landing/LostFoundLanding";
import { LOST_FOUND_STRINGS } from "@features/lost-found/constants/lostFoundStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: LOST_FOUND_STRINGS.meta.title,
  description: LOST_FOUND_STRINGS.meta.description,
};

export default function LostFoundHubPage() {
  return (
    <div className="flex flex-col">
      <LostFoundLanding />
      <SmallFooter />
    </div>
  );
}
