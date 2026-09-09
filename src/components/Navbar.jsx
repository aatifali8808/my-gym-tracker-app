import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "🏠 Home" },
    { path: "/workout", label: "💪 Workout" },
    { path: "/progress", label: "📊 Progress" },
    { path: "/prs", label: "🏆 PRs" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800">
      <div className="grid grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-center py-3 text-sm ${
              location.pathname === item.path
                ? "text-white font-bold"
                : "text-zinc-500"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
