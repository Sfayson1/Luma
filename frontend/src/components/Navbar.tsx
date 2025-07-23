import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ProfileAvatar  from "../components/ProfileAvatar";
import NotificationDropdown from "../pages/NotificationDropdown";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("U");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUserId(user.id);

          // Get user's profile to get first and last name
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", user.id)
            .single();

          if (profile && profile.first_name && profile.last_name) {
            // Generate initials from first and last name
            const initials =
              `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
            setUserInitials(initials);
          } else {
            // Fallback to email initial if no name found
            setUserInitials(user.email?.charAt(0).toUpperCase() || "U");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
    { path: "/my-entries", label: "My Entries", icon: "📝" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
    { path: "/resources", label: "Resources", icon: "📚" },
  ];

  const settingsItems = [
    { path: "/settings/profile", label: "Edit Profile", icon: "👤" },
    { path: "/settings/privacy", label: "Privacy & Security", icon: "🔒" },
    { path: "/settings/notifications", label: "Notifications", icon: "🔔" },
    { path: "/settings/journal", label: "Journal Preferences", icon: "📝" },
    { path: "/settings/account", label: "Account", icon: "⚙️" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const isSettingsPath = () => {
    return location.pathname.startsWith("/settings");
  };

  return (
    <nav className="bg-primary border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="text-4xl font-['Playfair_Display'] font-bold text-[#A78BFA] dark:text-purple-400 transition-colors duration-300">
          <Link to="/dashboard">Luma</Link>
        </div>

        <div className="flex items-center space-x-8">
          {/* Main Navigation */}
          <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  isActivePath(item.path)
                    ? "text-[#A78BFA] dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-[#A78BFA] dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Add NotificationDropdown here */}
            <NotificationDropdown />
          </div>

          {/* Avatar Settings Dropdown - Extended hover area */}
          <div
            className="relative"
            onMouseEnter={() => setIsSettingsOpen(true)}
            onMouseLeave={() => setIsSettingsOpen(false)}
          >
            {/* Invisible padding area to bridge the gap */}
            <div className="absolute inset-0 -bottom-2 -right-2 -left-2"></div>

            <div
              className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                isSettingsPath()
                  ? "bg-purple-50 dark:bg-purple-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {currentUserId && (
                <ProfileAvatar
                  userId={currentUserId}
                  fallbackInitials={userInitials}
                />
              )}
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-all duration-300 ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Settings Dropdown */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-full pt-2 z-50">
                <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 transition-colors duration-300">
                  {settingsItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center space-x-3 ${
                        isActivePath(item.path)
                          ? "bg-purple-50 dark:bg-purple-900/20 text-[#A78BFA] dark:text-purple-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}

                  {/* Logout */}
                  <div className="border-t border-gray-100 dark:border-gray-600 mt-2 pt-2">
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300 flex items-center space-x-3 text-red-600 dark:text-red-400"
                      onClick={handleLogout}
                    >
                      <span className="text-lg">🚪</span>
                      <span className="font-medium">Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
