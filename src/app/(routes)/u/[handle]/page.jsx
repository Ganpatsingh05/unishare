import PublicPass from "@features/profile/components/PublicPass";
import { PROFILE_STRINGS } from "@features/profile/constants/profileStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: PROFILE_STRINGS.public.meta.title,
  description: PROFILE_STRINGS.public.meta.description,
};

export default async function PublicPassPage({ params }) {
  const { handle } = await params;
  return (
    <div className="flex flex-col">
      <PublicPass handle={decodeURIComponent(handle).replace(/^@/, "")} />
      <SmallFooter />
    </div>
  );
}
