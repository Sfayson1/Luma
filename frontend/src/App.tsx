import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/ DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FilterablePosts from "./components/FilterablePosts";
import Navbar from "./components/Navbar";
import SettingsMenu from "./components/SettingsMenu";
import EditProfilePage from "./components/EditProfilePage";
import PrivacySecurityPage from "./components/PrivacySecurityPage";
import NotificationPage from "./components/NotificationPage";
import NotificationDropdown from "./pages/NotificationDropdown";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import Resources from "./pages/Resources";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DisplaySettingsPage from "./components/DisplaySettingsPage";
import JournalPreferencesPage from "./components/JournalPreferencesPage";
import AccountSettingsPage from "./components/AccountSettingsPage";
import { ThemeProvider } from "./context/ThemeContext";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  // Define routes that should NOT show the navbar
  const routesWithoutNavbar = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const shouldShowNavbar = !routesWithoutNavbar.includes(location.pathname);

  return (
    <div className="min-h-screen bg-secondary transition-colors duration-300">
      {shouldShowNavbar && <Navbar />}

      <main className="transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/my-entries" element={<FilterablePosts />} />
          <Route path="/settings" element={<SettingsMenu />} />
          <Route path="/settings/profile" element={<EditProfilePage />} />
          <Route path="/settings/privacy" element={<PrivacySecurityPage />} />
          <Route path="/settings/notifications" element={<NotificationPage />} />
          <Route path="/notifications" element={<NotificationDropdown />} />
          <Route path="/notification" element={<AllNotificationsPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/settings/display" element={<DisplaySettingsPage/>} />
          <Route path="/settings/journal" element={<JournalPreferencesPage/>} />
          <Route path="/settings/account" element={<AccountSettingsPage/>} />
          <Route path="/terms" element={<TermsOfService/>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* Add more routes here as needed */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
