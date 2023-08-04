export const navItems = [
  { to: "/dashboard", name: "Overview", icon: "dashboard", end: true },
  {
    to: "users",
    name: "Users",
    icon: "users",
    isMetric: true,
    items: [{ to: "user-roles", name: "User Roles", icon: "userRole" }],
  },
  {
    to: "exhibitions",
    name: "Exhibitions",
    icon: "exhibitions",
    isMetric: true,
  },
  {
    to: "artists",
    name: "Artists",
    icon: "artists",
    isMetric: true,
  },
  {
    to: "artworks",
    name: "Artworks",
    icon: "artworks",
    isMetric: true,
    items: [
      { to: "artwork-statuses", name: "Artwork Statuses", icon: "artworkStatus" },
      { to: "artwork-images", name: "Artwork Images", icon: "artworkImage" },
    ],
  },
  { to: "/admin/search", name: "Search on Dashboard", icon: "searchDashboard" },
  { to: "/search", name: "Search on Site", icon: "search" },
  { to: "/", name: "Go to site", icon: "appWindow" },
]
