// Solar "Bold Duotone" icons (@solar-icons/react) for contact categories.
import { Buildings2Icon } from "@solar-icons/react/bold-duotone/buildings-2";
import { HomeSmileIcon } from "@solar-icons/react/bold-duotone/home-smile";
import { SirenRoundedIcon } from "@solar-icons/react/bold-duotone/siren-rounded";
import { SquareAcademicCapIcon } from "@solar-icons/react/bold-duotone/square-academic-cap";
import { UserRoundedIcon } from "@solar-icons/react/bold-duotone/user-rounded";
import { UsersGroupRoundedIcon } from "@solar-icons/react/bold-duotone/users-group-rounded";
import { WidgetIcon } from "@solar-icons/react/bold-duotone/widget";

const ICONS = {
  all: WidgetIcon,
  emergency: SirenRoundedIcon,
  administration: Buildings2Icon,
  academics: SquareAcademicCapIcon,
  hostel: HomeSmileIcon,
  student: UsersGroupRoundedIcon,
};

export const categoryIcon = (key) => ICONS[key] || UserRoundedIcon;
