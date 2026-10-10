import DocPage from "@features/info/doc/DocPage";
import { COOKIES } from "@features/info/legal/cookiesContent";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Cookie policy · UniShare",
  description: "UniShare uses one cookie to keep you signed in, and no tracking or analytics.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col">
      <DocPage doc={COOKIES} />
      <SmallFooter />
    </div>
  );
}
