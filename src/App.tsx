import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useThemeStore } from "@/store/useThemeStore";
import AppLayout from "@/components/layout/AppLayout";
import TeamSelection from "@/pages/TeamSelection";
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import EventsAndMaps from "@/pages/EventsAndMaps";
import WeatherPage from "@/pages/WeatherPage";
import LiveCameras from "@/pages/LiveCameras";
import CoachesAndTeam from "@/pages/CoachesAndTeam";
import ClubContacts from "@/pages/ClubContacts";
import NewsPage from "@/pages/NewsPage";
import Marketplace from "@/pages/Marketplace";
import SkillProgression from "@/pages/SkillProgression";
import SafetyChecklist from "@/pages/SafetyChecklist";
import Subscribe from "@/pages/Subscribe";
import SponsorsPage from "@/pages/SponsorsPage";
import BecomeSponsor from "@/pages/BecomeSponsor";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppInner = () => {
  const { team, mode } = useThemeStore();
  const themeClass = [
    team ? `team-${team}` : '',
    mode === 'night' ? 'night' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={themeClass}>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={team ? <Navigate to="/dashboard" replace /> : <TeamSelection />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/events" element={<EventsAndMaps />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/cameras" element={<LiveCameras />} />
          <Route path="/coaches" element={<CoachesAndTeam />} />
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
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
