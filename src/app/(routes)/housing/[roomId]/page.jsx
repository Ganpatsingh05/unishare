import RoomDetail from "@features/housing/components/detail/RoomDetail";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: "Room details | UniShare",
  description: "Photos, rent, move-in date and how to ask for a room near campus.",
};

export default async function RoomDetailPage({ params }) {
  const { roomId } = await params;
  return (
    <div className="flex flex-col">
      <RoomDetail roomId={roomId} />
      <SmallFooter />
    </div>
  );
}
