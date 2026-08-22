import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import type { contentForm } from "@/types/formType";
import { ChevronLeft, ExternalLink, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

export default function FormEditor() {
  // Controllo sessione
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

  const [form, setForm] = useState<contentForm>({
    formTitle: "",
    date: new Date(),
    formNote: "",
    formSubtitle: "",
    sections: [],
  });

  const createSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          sectionTitle: "Nuova sezione",
          sectionNote: "Note nuova sezione",
          fields: [],
        },
      ],
    }));
  };

  const updateSection = () => {};
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

      {/* Gestione form */}
      <div className="border shadow rounded-xl mt-8 p-4">
        <div className="flex justify-between">
          <h1 className="font-semibold text-xl">Creazione nuovo form</h1>
          <Button className="px-4 py-2">
            <span>Vai alla preview</span>
            <ExternalLink />
          </Button>
        </div>

        {/* Griglia dove a sinistra metto titolo e altro... */}
        <div className="grid grid-cols-8 mt-4 gap-4">
          <div className="col-span-2">
            <h2 className="font-medium text-lg">Dati Base Form</h2>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">Nome form</FieldLabel>
              <Input required className=""></Input>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">
                Descrizione form
              </FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">Note form</FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>

            {/*  Informazioni form che non andranno pubblicate */}
            <h2 className="font-medium text-lg mt-4">Dati Base Form</h2>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">Nome form</FieldLabel>
              <Input required className=""></Input>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">
                Descrizione form
              </FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">Note form</FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>
          </div>
          <div className="col-span-6">
            <h2 className="font-medium text-lg">Campi del form</h2>
            <div className="border shadow rounded-xl mt-8 p-4">
              {form.sections.length === 0 ? (
                <div className="flex flex-col justify-center gap-4 items-center">
                  <div className="flex gap-4 justify-center items-center text-gray-600">
                    <Info className="w-6 h-6" />
                    <span className="text-lg">
                      Crea la tua prima sezione per cominciare
                    </span>
                  </div>
                  <Button onClick={createSection} className="px-8 h-11!">
                    Crea ora
                  </Button>
                </div>
              ) : (
                <>
                  {form.sections.map((s) => (
                    <div className="border shadow rounded-xl mt-4 p-4">
                      <Input
                        value={s.sectionTitle}
                        onChange={(e) => {}}
                        className="text-lg font-semibold"
                      ></Input>
                      <p className="text-gray-500">{s.sectionNote}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
