import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
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

// Ultra-fast React Query configuration optimized for mobile performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - prevent unnecessary refetches
      gcTime: 30 * 60 * 1000, // 30 minutes cache retention for offline
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Use cache first for instant loads
      refetchOnReconnect: true,
      retry: 1, // Single retry for speed
      retryDelay: 200, // Fast retry
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 200,
      networkMode: 'online',
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OptimizedGoalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
  </ErrorBoundary>
);

export default App;
