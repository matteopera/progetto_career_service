import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/admin/login";
import Form from "./pages/company/formPage";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/admin/dashboard";
import AdminLayout from "./components/adminLayout";
import { TooltipProvider } from "./components/ui/tooltip";
import Companies from "./pages/admin/companies";
import Forms from "./pages/admin/forms";
import FormEditor from "./pages/admin/form/formEditor";
import FormAdminPage from "./pages/admin/form/form";
import PdfPage from "./pages/company/pdfPage";
import IscrizioneEffettuata from "./pages/company/iscrizioneEffettuata";
function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/form/:formId" element={<Form />} />
          <Route path="/company/form" element={<Form />} />
          <Route path="/company/pdf" element={<PdfPage />} />
          <Route
            path="/company/iscrizione-effettuata"
            element={<IscrizioneEffettuata />}
          />
          {/* Rotte admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <AdminLayout>
                <Companies />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/forms"
            element={
              <AdminLayout>
                <Forms />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/form"
            element={
              <AdminLayout>
                <FormAdminPage />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/form/:idForm"
            element={
              <AdminLayout>
                <FormAdminPage />
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
