import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TransactionProvider } from "@/context/TransactionContext";
import { ReminderProvider } from "@/context/ReminderContext";
import { IncomeProvider } from "@/context/IncomeContext";
import { DashboardProvider } from "@/context/DashboardContext";
import { MenuProvider } from "@/context/MenuContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import BackendTest from "./pages/BackendTest";

const queryClient = new QueryClient();

// Protected route - requires authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public route - redirects to dashboard if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Create router configuration
// Future flags prepare the app for React Router v7 migration
// These flags enable v7 behaviors while maintaining v6 compatibility
const routerConfig = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      path: "/test-backend",
      element: <BackendTest />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    future: {
      // v7_startTransition: Uses React's startTransition for navigations
      // This makes route transitions non-blocking and improves perceived performance
      // Required to suppress deprecation warnings and prepare for React Router v7
      v7_startTransition: true,
      
      // v7_relativeSplatPath: Changes how relative paths work with splat routes (*)
      // This fixes edge cases with relative navigation in v7
      // Recommended for better path resolution behavior
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TransactionProvider>
          <ReminderProvider>
            <IncomeProvider>
              <DashboardProvider>
                <MenuProvider>
                  <TooltipProvider>
                    <Sonner />
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="colored"
                    />
                    <RouterProvider router={routerConfig} />
                  </TooltipProvider>
                </MenuProvider>
              </DashboardProvider>
            </IncomeProvider>
          </ReminderProvider>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
