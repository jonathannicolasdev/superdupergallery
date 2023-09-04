export const navItems = [
  {
    to: "/dashboard",
    name: "Overview",
    icon: "dashboard",
    end: true,
  },
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
    intent: "add-exhibition",
  },
  {
    to: "artists",
    name: "Artists",
    icon: "artists",
    isMetric: true,
    intent: "add-artist",
  },
  {
    to: "artworks",
    name: "Artworks",
    icon: "artworks",
    isMetric: true,
    intent: "add-artwork",
    items: [
      { to: "artwork-statuses", name: "Artwork Statuses", icon: "artworkStatus" },
      { to: "artwork-images", name: "Artwork Images", icon: "artworkImage" },
    ],
  },
  { to: "/admin/search", name: "Search on Dashboard", icon: "searchDashboard" },
  { to: "/search", name: "Search on Site", icon: "search" },
  { to: "/", name: "Go to site", icon: "appWindow" },
]
