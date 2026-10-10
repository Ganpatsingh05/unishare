// Solar "Bold Duotone" icons (@solar-icons/react, MIT) for things people
// lose. Imported one file each so only these icons ship.
import { BackpackIcon } from "@solar-icons/react/bold-duotone/backpack";
import { BatteryChargeIcon } from "@solar-icons/react/bold-duotone/battery-charge";
import { BookIcon } from "@solar-icons/react/bold-duotone/book";
import { BottleIcon } from "@solar-icons/react/bold-duotone/bottle";
import { BoxIcon } from "@solar-icons/react/bold-duotone/box";
import { CrownMinimalisticIcon } from "@solar-icons/react/bold-duotone/crown-minimalistic";
import { GlassesIcon } from "@solar-icons/react/bold-duotone/glasses";
import { HeadphonesRoundIcon } from "@solar-icons/react/bold-duotone/headphones-round";
import { KeyIcon } from "@solar-icons/react/bold-duotone/key";
import { LaptopIcon } from "@solar-icons/react/bold-duotone/laptop";
import { SmartphoneIcon } from "@solar-icons/react/bold-duotone/smartphone";
import { UserIdIcon } from "@solar-icons/react/bold-duotone/user-id";
import { WalletIcon } from "@solar-icons/react/bold-duotone/wallet";
import { WatchRoundIcon } from "@solar-icons/react/bold-duotone/watch-round";
import { WidgetIcon } from "@solar-icons/react/bold-duotone/widget";

/** Icon for each kind of item (see utils/itemModel CATEGORIES). */
export const CATEGORY_ICONS = {
  all: WidgetIcon,
  wallet: WalletIcon,
  id: UserIdIcon,
  keys: KeyIcon,
  charger: BatteryChargeIcon,
  watch: WatchRoundIcon,
  audio: HeadphonesRoundIcon,
  phone: SmartphoneIcon,
  laptop: LaptopIcon,
  bag: BackpackIcon,
  bottle: BottleIcon,
  glasses: GlassesIcon,
  jewel: CrownMinimalisticIcon,
  books: BookIcon,
  other: BoxIcon,
};
