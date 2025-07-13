import {
  ChevronDownIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  MinusIcon,
} from '@heroicons/react/24/outline';

// Centralized icon configuration
export const Icons = {
  // Navigation
  expandSection: ChevronDownIcon,
  collapseSection: ChevronDownIcon, // Same icon, rotated via CSS
  currentItem: ChevronLeftIcon,
  nonExpandableItem: MinusIcon,
  
  // Sidebar controls
  toggleSidebar: ChevronLeftIcon,
  settings: Cog6ToothIcon,
  soundOn: SpeakerWaveIcon,
  soundOff: SpeakerXMarkIcon,
  help: QuestionMarkCircleIcon,
  
  // Mobile
  mobileMenu: Bars3Icon,
} as const;

// Type for icon props to ensure consistency
export type IconProps = {
  className?: string;
  'aria-hidden'?: boolean;
}; 