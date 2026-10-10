import DocPage from "@features/info/doc/DocPage";
import { TERMS } from "@features/info/legal/termsContent";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Terms of service · UniShare",
  description: "The rules for using UniShare, in plain language.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col">
      <DocPage doc={TERMS} />
      <SmallFooter />
    </div>
  );
}
