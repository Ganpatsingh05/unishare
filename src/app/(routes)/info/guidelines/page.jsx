import GuidelinesPage from "@features/info/guidelines/GuidelinesPage";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Community guidelines · UniShare",
  description: "How students use UniShare together: staying safe, being honest, and the few things that are never allowed.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="flex flex-col">
      <GuidelinesPage />
      <SmallFooter />
    </div>
  );
}
