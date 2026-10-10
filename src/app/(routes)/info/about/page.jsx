import AboutPage from "@features/info/about/AboutPage";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "About · UniShare",
  description: "UniShare is one place for students to share rides and rooms, pass on things and tickets, find what's lost, and keep up with campus.",
};

export default function AboutUniSharePage() {
  return (
    <div className="flex flex-col">
      <AboutPage />
      <SmallFooter />
    </div>
  );
}
