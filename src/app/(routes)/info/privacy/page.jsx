import DocPage from "@features/info/doc/DocPage";
import { PRIVACY } from "@features/info/legal/privacyContent";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Privacy policy · UniShare",
  description: "What UniShare collects, who can see it, who it's shared with, and your rights over your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <DocPage doc={PRIVACY} />
      <SmallFooter />
    </div>
  );
}
