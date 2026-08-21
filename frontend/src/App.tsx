import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/admin/login";
import Form from "./pages/form";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/admin/dashboard";
import AdminLayout from "./components/adminLayout";
import { TooltipProvider } from "./components/ui/tooltip";
import Companies from "./pages/admin/companies";
import Forms from "./pages/admin/forms";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/form" element={<Form />} />

          <Route
            path="/dashboard"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/companies"
            element={
              <AdminLayout>
                <Companies />
              </AdminLayout>
            }
          />
          <Route
            path="/forms"
            element={
              <AdminLayout>
                <Forms />
              </AdminLayout>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
