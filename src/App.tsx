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
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import OptimizedIndex from "./pages/OptimizedIndex";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - longer stale time for faster loads
      gcTime: 60 * 60 * 1000, // 1 hour cache
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on mount for faster loads
      refetchOnReconnect: false, // Don't refetch on reconnect for faster loads
      retry: 1, // Reduce retries for faster error handling
      retryDelay: 1000, // Faster retry delay
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
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
