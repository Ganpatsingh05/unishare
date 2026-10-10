// Solar "Bold Duotone" icons (@solar-icons/react) for marketplace categories.
import { BicyclingIcon } from "@solar-icons/react/bold-duotone/bicycling";
import { BookIcon } from "@solar-icons/react/bold-duotone/book";
import { BoxIcon } from "@solar-icons/react/bold-duotone/box";
import { GamepadIcon } from "@solar-icons/react/bold-duotone/gamepad";
import { HeadphonesRoundIcon } from "@solar-icons/react/bold-duotone/headphones-round";
import { LaptopIcon } from "@solar-icons/react/bold-duotone/laptop";
import { SofaIcon } from "@solar-icons/react/bold-duotone/sofa";
import { WidgetIcon } from "@solar-icons/react/bold-duotone/widget";

const ICONS = {
  all: WidgetIcon,
  electronics: LaptopIcon,
  books: BookIcon,
  furniture: SofaIcon,
  accessories: HeadphonesRoundIcon,
  cycles: BicyclingIcon,
  gaming: GamepadIcon,
  other: BoxIcon,
};
export const categoryIcon = (key) => ICONS[key] || BoxIcon;

// Condition colours: light, dark.
const CONDITION_COLORS = {
  new: ["#13795B", "#4FD1A5"],
  "like-new": ["#1D6FE0", "#7CB8FF"],
  good: ["#0F766E", "#5EEAD4"],
  fair: ["#9A5600", "#FFC46B"],
  damaged: ["#B4232B", "#FF8A93"],
};
export const conditionColor = (key, dark) => (CONDITION_COLORS[key] || CONDITION_COLORS.good)[dark ? 1 : 0];
