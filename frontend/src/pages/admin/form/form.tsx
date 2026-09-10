import { authClient } from "@/lib/auth-client";
import type { contentForm, form } from "@/types/formType";
import {
  Check,
  ChevronLeft,
  ExternalLink,
  Form,
  icons,
  Loader2,
  LucideGlasses,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import FormEditor from "./formEditor";
import { Button } from "@/components/ui/button";
import FormBase from "./formBase";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormReview from "./formReview";

export default function FormAdminPage() {
  // Controllo sessione default
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

  // Gestione navigazione
  const navigate = useNavigate();

  const [form, setForm] = useState<Omit<form, "_id" | "lastEdit" | "created">>({
    title: "",
    note: "",
    content: {
      formTitle: "",
      formNote: "",
      formSubtitle: "",
      sections: [],
    },
    status: "draft",
  });

  // Gestione steps
  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Dati base",
      completed: false,
      icon: Plus,
    },
    {
      id: 2,
      title: "Creazione campi",
      completed: false,
      icon: Form,
    },
    {
      id: 3,
      title: "Revisione finale",
      completed: false,
      icon: LucideGlasses,
    },
    {
      id: 4,
      title: "Completato",
      completed: false,
      icon: Check,
    },
  ]);

  const [presentStepIndex, setPresentStepIndex] = useState<number>(0); // ci va id
  const goToStep = (index: number) => {
    if (index >= 0 && index < 4) {
      setPresentStepIndex(index);
      const updatedSteps = steps.map((s, i) =>
        i < index ? { ...s, completed: true } : { ...s, completed: false },
      );
      setSteps(updatedSteps);
      localStorage.setItem("formInCostruzione", JSON.stringify(form));
    }
  };

  // Gestione form non salvato
  const [draftFormDialogOpen, setDraftFormDialogOpen] = useState(false);

  useEffect(() => {
    const draftForm = localStorage.getItem("formInCostruzione");
    if (draftForm) {
      setDraftFormDialogOpen(true);
    }
  }, []);

  const recoveryForm = () => {
    const draftForm = localStorage.getItem("formInCostruzione");
    if (draftForm) {
      setForm(JSON.parse(draftForm));
    }
    setDraftFormDialogOpen(false);
  };

  const deleteCachedForm = () => {
    localStorage.setItem("formInCostruzione", "");
    setDraftFormDialogOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex gap-4 items-center">
        <Button
          variant={"outline"}
          onClick={() => {
            navigate("/admin/forms");
          }}
        >
          <ChevronLeft />
        </Button>
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Crea Nuovo Form</h1>
          <p className="text-sm text-gray-500">
            Gestisci i form della piattaforma
          </p>
        </div>
      </div>
      {/* Steps  */}
      <div className="border shadow rounded-xl mt-8 p-4">
        <div className="w-[75%] mx-auto flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 relative"
            >
              <div className="border rounded-full p-4 bg-white ">
                <step.icon
                  className={`w-5 h-5 ${step.completed ? "text-black" : "text-gray-500"}`}
                />
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-7 -z-10 w-full h-0.5 ${step.completed ? "bg-black" : "bg-gray-200"}`}
                  ></div>
                )}
              </div>
              <p
                className={`${step.completed ? "text-black" : "text-gray-500"}`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      {steps[presentStepIndex].id === 1 ? (
        <FormBase form={form} setForm={setForm} goToStep={goToStep} />
      ) : steps[presentStepIndex].id === 2 ? (
        <FormEditor form={form} setForm={setForm} goToStep={goToStep} />
      ) : steps[presentStepIndex].id === 3 ? (
        <FormReview form={form} setForm={setForm} goToStep={goToStep} />
      ) : steps[presentStepIndex].id === 4 ? (
        <></>
      ) : (
        <Navigate to="/admin/dashboard" />
      )}

      <Dialog onOpenChange={setDraftFormDialogOpen} open={draftFormDialogOpen}>
        <DialogContent onInteractOutside={() => null}>
          <DialogHeader>
            <DialogTitle>Rilevato form non salvato</DialogTitle>
          </DialogHeader>
          <p>
            Stavi costruendo un form e non è stato completato e portato al
            salvataggio finale. Vuoi recuperare i dati?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={deleteCachedForm}>
              Elimina vecchio form
            </Button>
            <Button type="submit" onClick={recoveryForm}>
              Recupera form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
