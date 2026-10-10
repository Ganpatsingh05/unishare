import DocPage from "@features/info/doc/DocPage";
import { DATA_PROTECTION } from "@features/info/legal/dataProtectionContent";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Data protection · UniShare",
  description: "How to see, change or delete your data on UniShare, and what deleting your account removes.",
};

export default function DataProtectionPage() {
  return (
    <div className="flex flex-col">
      <DocPage doc={DATA_PROTECTION} />
      <SmallFooter />
    </div>
  );
}
