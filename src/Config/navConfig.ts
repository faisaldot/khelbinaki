import {
  UserPen,
  NotebookTabs,
  BarChart3,
  ClipboardList,
  Trees,
  Building2,
  Users,
  PlusSquare,
  UserPlus,
} from "lucide-react";

export const navConfig = {
  user: [
    { path: "/dashboard/profile", label: "Profile Management", icon: UserPen },
    { path: "/dashboard/my-bookings", label: "My Bookings", icon: NotebookTabs },
  ],
  admin: [
    { path: "/dashboard/profile", label: "Profile Management", icon: UserPen },
    { path: "/dashboard/admin/statistic", label: "Statistic", icon: BarChart3 },
    { path: "/dashboard/admin/bookings", label: "Booking Management", icon: ClipboardList },
    { path: "/dashboard/admin/turfs", label: "Turf Management", icon: Trees },
    // { path: "/dashboard/reports", label: "Reports", icon: FileBarChart }
  ],
  manager: [
    { path: "/dashboard/manager/statistics", label: "Statistics", icon: BarChart3 },
    { path: "/dashboard/profile", label: "Profile Management", icon: UserPen },
    // Statistics
    { path: "/dashboard/manager/turfs", label: "Manage Turfs", icon: Building2 },
    { path: "/dashboard/manager/users", label: "Manage Users", icon: Users },          // Manage Users
    { path: "/dashboard/manager/create-turf", label: "Create Turf", icon: PlusSquare }, // Create Turf
    { path: "/dashboard/manager/create-admin", label: "Create Admin", icon: UserPlus }, // Create Admin
  ]

};
