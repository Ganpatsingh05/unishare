import { Suspense } from "react";
import ActivityPage from "@features/activity/components/ActivityPage";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "My activity · UniShare",
  description: "Requests you've received and sent across UniShare, in one place.",
};

export default function MyActivity() {
  return (
    <div className="flex flex-col">
      {/* The page reads ?tab= and ?feature= from the URL. */}
      <Suspense fallback={null}>
        <ActivityPage />
      </Suspense>
      <SmallFooter />
    </div>
  );
}
