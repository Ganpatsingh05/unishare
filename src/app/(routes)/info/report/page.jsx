import ReportPage from "@features/info/report/ReportPage";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Report a problem · UniShare",
  description: "Tell the UniShare team about a person, a post or a page that isn't working.",
};

export default function ReportIssuesPage() {
  return (
    <div className="flex flex-col">
      <ReportPage />
      <SmallFooter />
    </div>
  );
}
