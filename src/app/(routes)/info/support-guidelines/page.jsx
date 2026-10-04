import SafetyPage from "@features/info/safety/SafetyPage";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Safety guidelines · UniShare",
  description: "Simple habits for meeting, riding and trading with other students safely, and how to spot a scam.",
};

export default function SafetyGuidelinesPage() {
  return (
    <div className="flex flex-col">
      <SafetyPage />
      <SmallFooter />
    </div>
  );
}
