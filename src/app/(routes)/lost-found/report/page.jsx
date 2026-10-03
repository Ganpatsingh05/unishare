import ReportItem from "@features/lost-found/components/report/ReportItem";
import { LOST_FOUND_STRINGS } from "@features/lost-found/constants/lostFoundStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: LOST_FOUND_STRINGS.report.meta.title,
  description: LOST_FOUND_STRINGS.report.meta.description,
};

export default function ReportPage() {
  return (
    <div className="flex flex-col">
      <ReportItem />
      <SmallFooter />
    </div>
  );
}
