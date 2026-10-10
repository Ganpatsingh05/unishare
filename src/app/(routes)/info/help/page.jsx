import HelpCenter from "@features/info/help/HelpCenter";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Help · UniShare",
  description: "Short answers about rides, rooms, the marketplace, tickets, lost and found, and your account on UniShare.",
};

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      <HelpCenter />
      <SmallFooter />
    </div>
  );
}
