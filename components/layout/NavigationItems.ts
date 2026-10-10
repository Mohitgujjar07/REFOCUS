import {
  CalendarDays,
  Apple,
  Dumbbell,
  LineChart,
  CheckSquare,
  Sparkles,
  Settings,
} from "lucide-react";

export interface NavItemConfig {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimaryMobile?: boolean;
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    name: "Today",
    href: "/today",
    icon: CalendarDays,
    isPrimaryMobile: true,
  },
  {
    name: "Nutrition",
    href: "/nutrition",
    icon: Apple,
    isPrimaryMobile: true,
  },
  {
    name: "Training",
    href: "/training",
    icon: Dumbbell,
    isPrimaryMobile: true,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: LineChart,
    isPrimaryMobile: true,
  },
  {
    name: "Habits",
    href: "/habits",
    icon: CheckSquare,
    isPrimaryMobile: false,
  },
  {
    name: "Weekly Review",
    href: "/weekly-review",
    icon: Sparkles,
    isPrimaryMobile: false,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    isPrimaryMobile: false,
  },
];
