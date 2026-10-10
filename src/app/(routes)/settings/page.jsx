import SettingsPage from "@features/settings/components/SettingsPage";
import { SETTINGS_STRINGS } from "@features/settings/settingsStrings";
import SmallFooter from "@components/layout/SmallFooter";

export const metadata = {
  title: SETTINGS_STRINGS.meta.title,
  description: SETTINGS_STRINGS.meta.description,
};

export default function Settings() {
  return (
    <div className="flex flex-col">
      <SettingsPage />
      <SmallFooter />
    </div>
  );
}
