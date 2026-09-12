import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodForm, zodStatusForm, type form } from "@/types/formType";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import z from "zod";

export default function formBase({
  form,
  setForm,
  goToStep,
}: {
  form: Omit<form, "lastEdit" | "created">;
  setForm: Dispatch<SetStateAction<Omit<form, "lastEdit" | "created">>>;
  goToStep: (index: number) => void;
}) {
  const [errorBaseForm, setErrorBaseForm] = useState<{
    formTitle: string;
    formNote: string;
    formSubtitle: string;
    title: string;
    note: string;
    status: string;
  }>({
    formTitle: "",
    formNote: "",
    formSubtitle: "",
    title: "",
    note: "",
    status: "",
  });

  // Schema zod per campi
  const formBaseZod = z.object({
    formTitle: z
      .string()
      .min(1, { error: "Il titolo del form è obbligatorio" }),
    formSubtitle: z
      .string()
      .min(1, { error: "Il sottotitolo del form è obbligatorio" }),
    formNote: z.string().optional(),
    title: z
      .string()
      .min(1, { error: "Il titolo interno del form è obbligatorio" }),
    note: z.string().optional(),
    status: zodStatusForm,
  });

  const checkGoNext = () => {
    // controllo validazione
    const result = formBaseZod.safeParse({
      formTitle: form.content.formTitle,
      formSubtitle: form.content.formSubtitle,
      formNote: form.content.formNote,
      title: form.title,
      note: form.note,
      status: form.status,
    });

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      setErrorBaseForm({
        formTitle: flattened.fieldErrors.formTitle?.join(" ") || "",
        formSubtitle: flattened.fieldErrors.formSubtitle?.join(" ") || "",
        formNote: flattened.fieldErrors.formNote?.join(" ") || "",
        title: flattened.fieldErrors.title?.join(" ") || "",
        note: flattened.fieldErrors.note?.join(" ") || "",
        status: flattened.fieldErrors.status?.join(" ") || "",
      });
      return;
    }

    goToStep(1);
  };

  return (
    <div className="border shadow rounded-xl mt-8 p-4">
      <div className="flex justify-between mb-4">
        <Button disabled className="px-4 h-10!">
          <ChevronLeft />
          <span>Vai allo step precedente</span>
        </Button>
        <h1 className="font-semibold text-2xl">Dettagli base del form</h1>
        <Button onClick={() => checkGoNext()} className="px-4 h-10!">
          <span>Vai al prossimo step</span>
          <ChevronRight />
        </Button>
      </div>

      <h2 className="font-medium text-lg ">Dati Base Form</h2>
      <p className="text-sm text-gray-700">
        In questa sezione sono presenti informazioni che verranno visualizzate
        sia nel form che nella generazione del PDF finale
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle" className="">
            Titolo form
            <p className="text-red-500 text-sm ">{errorBaseForm.formTitle}</p>
          </FieldLabel>
          <Input
            value={form.content.formTitle}
            onFocus={() =>
              setErrorBaseForm((prev) => ({ ...prev, formTitle: "" }))
            }
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                content: { ...prev.content, formTitle: e.target.value },
              }))
            }
            required
            className={`${errorBaseForm.formTitle !== "" && "border-red-500"}`}
          />
          <span className="text-gray-500 text-sm">
            Il titolo verrò mostrato in alto all'interno del form
          </span>
        </Field>
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle">
            Sottotitolo form
            <p className="text-red-500 text-sm ">
              {errorBaseForm.formSubtitle}
            </p>
          </FieldLabel>
          <Input
            required
            onFocus={() =>
              setErrorBaseForm((prev) => ({ ...prev, formSubtitle: "" }))
            }
            value={form.content.formSubtitle}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                content: { ...prev.content, formSubtitle: e.target.value },
              }))
            }
            className={`${errorBaseForm.formSubtitle !== "" && "border-red-500"}`}
          />
          <span className="text-gray-500 text-sm">
            Il sottotitolo verrà mostrato dopo il titolo all'interno del form
          </span>
        </Field>
      </div>
      <Field className="mt-4">
        <FieldLabel htmlFor="field.fieldTitle">Note form</FieldLabel>
        <Textarea
          required
          className=""
          value={form.content.formNote}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              content: { ...prev.content, formNote: e.target.value },
            }))
          }
        ></Textarea>
        <span className="text-gray-500 text-sm">
          Le note del form verranno mostrate in un apposito riquadro dopo il
          sottotitolo
        </span>
      </Field>

      <hr className="my-8" />
      {/*  Informazioni form che non andranno pubblicate */}
      <h2 className="font-medium text-lg  ">Dati Interni Form</h2>
      <p className="text-sm text-gray-700">
        In questa sezione si possono aggiungere altre informazioni utili che
        rimarranno a disposizione solamente nella dashboard
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle" className="">
            Titolo form interno
            <p className="text-red-500 text-sm ">{errorBaseForm.title}</p>
          </FieldLabel>
          <Input
            value={form.title}
            onFocus={() => {
              setErrorBaseForm((prev) => ({ ...prev, title: "" }));
            }}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className={`${errorBaseForm.title !== "" && "border-red-500"}`}
          />
        </Field>
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle">Status form</FieldLabel>
          <Select
            defaultValue="draft"
            value={form.status}
            onValueChange={(status: "draft" | "online" | "offline") =>
              setForm((prev) => ({ ...prev, status: status }))
            }
          >
            <SelectTrigger className="w-1/4 h-11!">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="draft">In bozza</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field className="mt-4">
        <FieldLabel htmlFor="field.fieldTitle">Note form</FieldLabel>
        <Textarea
          value={form.note}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, note: e.target.value }))
          }
          className=""
        ></Textarea>
      </Field>
    </div>
  );
}
