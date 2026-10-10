import HomePage from "@features/home/components/HomePage";
import Footer from "@components/layout/LazyFooter";

export const metadata = {
  title: "UniShare: your campus, shared",
  description: "Rides, rooms, tickets, notes, lost things and campus news, shared by students in one place.",
};

export default function Page() {
  return (
    <>
      <HomePage />
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
