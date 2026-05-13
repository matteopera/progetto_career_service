import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home";
import Login from "./pages/admin/login";
import Form from "./pages/form";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/admin/dashboard";
import { authClient } from "./lib/auth-client";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import AdminLayout from "./components/adminLayout";
import { TooltipProvider } from "./components/ui/tooltip";
import Companies from "./pages/admin/companies";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/form" element={<Form />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Companies />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </TooltipProvider>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }
  if (!session || !session.user) {
    return <Navigate to={"/login"} />;
  }

  return children;
}

export default App;
