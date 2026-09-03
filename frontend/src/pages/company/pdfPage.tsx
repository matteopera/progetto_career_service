import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useLocation } from "react-router";
export default function pdfPage() {
  const location = useLocation();
  const { id } = location.state || {};
  return (
    <div>
      <nav className="border-b border-gray-300">
        <img
          src="/logo_univr.png"
          alt="Logo Università di Verona"
          className="w-54 mx-auto "
        />
      </nav>
      <div className="md:ml-32 md:mr-32 ">
        <div className="flex flex-row items-center justify-between p-5 border border-gray-300 rounded-2xl mt-3">
        <div>
            <h1 className="text-4xl font-bold">Iscrizione espositori- completa</h1>
            <p className="text-gray-400">Inviata il 3/09/2026 alle ore che vuoi</p>
        </div>
<p className="bg-green-100 text-green-700 pl-2 pr-2 rounded-2xl">Approvata</p>
        
        </div>
        <div className="flex flex-row items-center justify-between p-5 border border-gray-300 rounded-2xl mt-3">
            <h2 className="text-2xl">Il tuo riepilogo</h2>
        </div>
      </div>
    </div>
  );
}
