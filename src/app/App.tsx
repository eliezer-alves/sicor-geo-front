import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useTheme } from "@/hooks/useTheme";
import { Topbar } from "@/components/layout/Topbar";
import { MapPage } from "@/pages/MapPage";
import { ReportsPage } from "@/pages/ReportsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-dvh flex-col overflow-hidden">
          <Topbar theme={theme} onToggleTheme={toggle} />
          <main className="relative flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/map" replace />} />
              <Route path="/map" element={<MapPage theme={theme} />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
