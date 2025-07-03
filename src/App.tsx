import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { OptimizedGoalProvider } from "./context/OptimizedGoalContext";
import Achievements from "./pages/Achievements";
import Auth from "./pages/Auth";
import Demo from "./pages/Demo";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import OptimizedIndex from "./pages/OptimizedIndex";
import Wins from "./pages/Wins";

// Maximum performance React Query configuration for sub-second loading
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always use cache immediately
      gcTime: 60 * 60 * 1000, // 1 hour cache retention
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Never refetch on mount for instant cache hits
      refetchOnReconnect: false, 
      retry: 0, // No retries for absolute maximum speed
      retryDelay: 0,
      // Enable instant loading features
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 100, // Very fast mutation retry
      networkMode: 'online',
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <OptimizedGoalProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/app" element={
                <ProtectedRoute>
                  <OptimizedIndex />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } />
              <Route path="/wins" element={<Wins />} />
              <Route path="/demo" element={
                <ProtectedRoute>
                  <Demo />
                </ProtectedRoute>
              } />
              <Route path="/index" element={<Navigate to="/app" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OptimizedGoalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
