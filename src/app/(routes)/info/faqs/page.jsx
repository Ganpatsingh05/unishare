import FaqPage from "@features/info/faqs/FaqPage";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "FAQs · UniShare",
  description: "Quick answers about UniShare: payments, requests, posting, your account and safety.",
};

export default function FaqsPage() {
  return (
    <div className="flex flex-col">
      <FaqPage />
      <SmallFooter />
    </div>
  );
}
