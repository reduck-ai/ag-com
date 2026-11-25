import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCircle,
  faCircleCheck,
  faCircleXmark,
  faCopy,
  faFile,
  faImage,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowDown,
  faArrowUp,
  faArrowUpRightFromSquare,
  faBars,
  faBrain,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleExclamation,
  faDownload,
  faKey,
  faPlus,
  faRobot,
  faStop,
  faTag,
  faTerminal,
  faWrench,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils";

// FontAwesome free, as Reduck's interfaces use FontAwesome only and a public repository cannot ship
// its Pro icons. Each icon is a component taking a className, so a call site reads like any other.
function icon(definition: IconDefinition) {
  return function Icon({ className }: { readonly className?: string }) {
    return <FontAwesomeIcon aria-hidden className={cn("shrink-0", className)} icon={definition} />;
  };
}

export const AlertCircleIcon = icon(faCircleExclamation);
export const ArrowDownIcon = icon(faArrowDown);
export const ArrowUpIcon = icon(faArrowUp);
export const BotIcon = icon(faRobot);
export const BrainIcon = icon(faBrain);
export const CheckCircleIcon = icon(faCircleCheck);
export const CheckIcon = icon(faCheck);
export const ChevronDownIcon = icon(faChevronDown);
export const ChevronLeftIcon = icon(faChevronLeft);
export const ChevronRightIcon = icon(faChevronRight);
export const ChevronUpIcon = icon(faChevronUp);
export const CircleIcon = icon(faCircle);
export const CloseIcon = icon(faXmark);
export const CopyIcon = icon(faCopy);
export const DownloadIcon = icon(faDownload);
export const ExternalLinkIcon = icon(faArrowUpRightFromSquare);
export const FileIcon = icon(faFile);
export const ImageIcon = icon(faImage);
export const KeyRoundIcon = icon(faKey);
export const MenuIcon = icon(faBars);
export const PlusIcon = icon(faPlus);
export const SquareIcon = icon(faStop);
export const TagIcon = icon(faTag);
export const TerminalIcon = icon(faTerminal);
export const WrenchIcon = icon(faWrench);
export const XCircleIcon = icon(faCircleXmark);
