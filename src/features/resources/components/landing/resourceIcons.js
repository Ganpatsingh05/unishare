// Solar "Bold Duotone" icons (@solar-icons/react) for resource categories and types.
import { BookmarkIcon } from "@solar-icons/react/bold-duotone/bookmark";
import { Buildings2Icon } from "@solar-icons/react/bold-duotone/buildings-2";
import { DocumentTextIcon } from "@solar-icons/react/bold-duotone/document-text";
import { DocumentsIcon } from "@solar-icons/react/bold-duotone/documents";
import { FileTextIcon } from "@solar-icons/react/bold-duotone/file-text";
import { LinkRoundIcon } from "@solar-icons/react/bold-duotone/link-round";
import { PlayCircleIcon } from "@solar-icons/react/bold-duotone/play-circle";
import { RulerPenIcon } from "@solar-icons/react/bold-duotone/ruler-pen";
import { SquareAcademicCapIcon } from "@solar-icons/react/bold-duotone/square-academic-cap";
import { VideoLibraryIcon } from "@solar-icons/react/bold-duotone/video-library";
import { WidgetIcon } from "@solar-icons/react/bold-duotone/widget";

const CATEGORY_ICONS = {
  all: WidgetIcon,
  academics: SquareAcademicCapIcon,
  tools: RulerPenIcon,
  campus: Buildings2Icon,
  docs: DocumentsIcon,
  media: VideoLibraryIcon,
};

export const TYPE_ICONS = {
  all: WidgetIcon,
  link: LinkRoundIcon,
  pdf: FileTextIcon,
  doc: DocumentTextIcon,
  video: PlayCircleIcon,
};

export const categoryIcon = (key) => CATEGORY_ICONS[key] || BookmarkIcon;
export const typeIcon = (key) => TYPE_ICONS[key] || LinkRoundIcon;

// Spine and stripe colours per category (light, dark).
const PALETTE = {
  academics: ["#1D6FE0", "#4EA3FF"],
  tools: ["#C2410C", "#FB923C"],
  campus: ["#0F766E", "#2DD4BF"],
  docs: ["#6D28D9", "#A78BFA"],
  media: ["#BE185D", "#F472B6"],
};
export function categoryColor(key, dark) {
  const pair = PALETTE[key] || ["#475569", "#94A3B8"];
  return dark ? pair[1] : pair[0];
}
