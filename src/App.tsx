import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useThemeStore } from "@/store/useThemeStore";
import { useInitializeData } from "@/hooks/useInitializeData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import DataSourceBanner from "@/components/DataSourceBanner";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppLayout from "@/components/layout/AppLayout";
import React, { Suspense } from "react";

const TeamSelection = React.lazy(() => import("@/pages/TeamSelection"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const CalendarPage = React.lazy(() => import("@/pages/CalendarPage"));
const EventsAndMaps = React.lazy(() => import("@/pages/EventsAndMaps"));
const WeatherPage = React.lazy(() => import("@/pages/WeatherPage"));
const LiveCameras = React.lazy(() => import("@/pages/LiveCameras"));
const CoachesAndTeam = React.lazy(() => import("@/pages/CoachesAndTeam"));
const FleetPage = React.lazy(() => import("@/pages/FleetPage"));
const ClubContacts = React.lazy(() => import("@/pages/ClubContacts"));
const NewsPage = React.lazy(() => import("@/pages/NewsPage"));
const Marketplace = React.lazy(() => import("@/pages/Marketplace"));
const SkillProgression = React.lazy(() => import("@/pages/SkillProgression"));
const SafetyChecklist = React.lazy(() => import("@/pages/SafetyChecklist"));
const Subscribe = React.lazy(() => import("@/pages/Subscribe"));
const SponsorsPage = React.lazy(() => import("@/pages/SponsorsPage"));
const BecomeSponsor = React.lazy(() => import("@/pages/BecomeSponsor"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const AppInner = () => {
  const { team, mode } = useThemeStore();
  useInitializeData();

  const themeClass = [
    team ? `team-${team}` : '',
    mode === 'night' ? 'night' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={themeClass}>
      <DataSourceBanner />
      <Toaster />
      <Sonner />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={team ? <Navigate to="/dashboard" replace /> : <TeamSelection />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/events" element={<EventsAndMaps />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/cameras" element={<LiveCameras />} />
            <Route path="/coaches" element={<CoachesAndTeam />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/contacts" element={<ClubContacts />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/skills" element={<SkillProgression />} />
            <Route path="/safety" element={<SafetyChecklist />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/become-sponsor" element={<BecomeSponsor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppInner />
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
