import { Button } from "@/components/ui/button";
import { CheckCircle, CheckCircle2Icon } from "lucide-react";
import { Link, useParams } from "react-router";

export default function FormCompleted() {
  const { idForm } = useParams();
  return (
    <div className="border shadow rounded-xl mt-8 p-16 flex justify-center gap-8 items-start">
      <CheckCircle2Icon className="bg-black text-white w-24 h-24 p-4 rounded-full" />
      <div className="flex flex-col ">
        <p className="text-2xl font-medium">
          Il tuo form è stato {idForm ? "aggiornato" : "creato"} con successo
        </p>
        <p className="text-gray-500">
          Torna al menù principale per visualizzare il nuovo form appena
          generato
        </p>
        <Link to={"/admin/forms"}>
          <Button className="mt-4 h-12">Torna al Menù</Button>
        </Link>
      </div>
    </div>
  );
}
