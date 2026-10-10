import MissionPage from "@features/info/mission/MissionPage";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Our mission · UniShare",
  description: "Why UniShare exists: to connect students who have something with students who need it, simply and safely.",
};

export default function OurMissionPage() {
  return (
    <div className="flex flex-col">
      <MissionPage />
      <SmallFooter />
    </div>
  );
}
