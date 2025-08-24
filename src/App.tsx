import React from "react";
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
import NPSAnalytics from "./pages/NPSAnalytics";
import OptimizedIndex from "./pages/OptimizedIndex";
import Wins from "./pages/Wins";

// Maximum performance React Query configuration for sub-second loading with offline support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - faster invalidation for real-time updates
      gcTime: 10 * 60 * 1000, // 10 minutes cache retention
      refetchOnWindowFocus: false,
      refetchOnMount: 'always', // Always refetch to ensure latest data
      refetchOnReconnect: true,
      retry: 2, // Allow retries for reliability
      retryDelay: 500,
      networkMode: 'online', // Only fetch when online for better error handling
    },
    mutations: {
      retry: 2,
      retryDelay: 500,
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
              <Route path="/nps-analytics" element={
                <ProtectedRoute>
                  <NPSAnalytics />
                </ProtectedRoute>
              } />
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
