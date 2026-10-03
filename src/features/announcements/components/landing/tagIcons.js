// Solar "Bold Duotone" icons (@solar-icons/react) for announcement topics.
import { ChatRoundDotsIcon } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { ConfettiIcon } from "@solar-icons/react/bold-duotone/confetti";
import { HashtagIcon } from "@solar-icons/react/bold-duotone/hashtag";
import { SirenIcon } from "@solar-icons/react/bold-duotone/siren";
import { SquareAcademicCapIcon } from "@solar-icons/react/bold-duotone/square-academic-cap";
import { UsersGroupRoundedIcon } from "@solar-icons/react/bold-duotone/users-group-rounded";
import { WidgetIcon } from "@solar-icons/react/bold-duotone/widget";

export const TAG_ICONS = {
  all: WidgetIcon,
  general: ChatRoundDotsIcon,
  events: ConfettiIcon,
  academics: SquareAcademicCapIcon,
  alerts: SirenIcon,
  clubs: UsersGroupRoundedIcon,
};

export const tagIcon = (tag) => TAG_ICONS[tag] || HashtagIcon;
