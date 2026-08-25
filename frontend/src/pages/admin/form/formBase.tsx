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
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export default function formBase({
  baseForm,
  setBaseForm,
  goToStep,
}: {
  baseForm: {
    formTitle: string;
    formNote: string;
    formSubtitle: string;
    title: string;
    note: string;
    status: "draft" | "online" | "offline";
  };
  setBaseForm: Dispatch<
    SetStateAction<{
      formTitle: string;
      formNote: string;
      formSubtitle: string;
      title: string;
      note: string;
      status: "draft" | "online" | "offline";
    }>
  >;
  goToStep: (index: number) => void;
}) {
  return (
    <div className="border shadow rounded-xl mt-8 p-4">
      <div className="flex justify-between mb-4">
        <Button disabled className="px-4 h-10!">
          <ChevronLeft />
          <span>Vai allo step precedente</span>
        </Button>
        <h1 className="font-semibold text-2xl">Dettagli base del form</h1>
        <Button onClick={() => goToStep(1)} className="px-4 h-10!">
          <span>Vai al prossimo step</span>
          <ChevronRight />
        </Button>
      </div>

      <h2 className="font-medium text-lg text-gray-600">Dati Base Form</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle" className="">
            Titolo form
          </FieldLabel>
          <Input
            value={baseForm.formTitle}
            onChange={(e) =>
              setBaseForm((prev) => ({ ...prev, formTitle: e.target.value }))
            }
            required
            className=""
          />
          <span className="text-gray-500 text-sm">
            Il titolo verrò mostrato in alto all'interno del form
          </span>
        </Field>
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle">Sottotitolo form</FieldLabel>
          <Input
            required
            value={baseForm.formSubtitle}
            onChange={(e) =>
              setBaseForm((prev) => ({ ...prev, formSubtitle: e.target.value }))
            }
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
          value={baseForm.formNote}
          onChange={(e) =>
            setBaseForm((prev) => ({ ...prev, formNote: e.target.value }))
          }
        ></Textarea>
        <span className="text-gray-500 text-sm">
          Le note del form verranno mostrate in un apposito riquadro dopo il
          sottotitolo
        </span>
      </Field>

      <hr className="my-8" />
      {/*  Informazioni form che non andranno pubblicate */}
      <h2 className="font-medium text-lg text-gray-600 ">Dati Interni Form</h2>
      <p className="text-sm">
        In questa sezione si possono aggiungere altre informazioni utili che
        rimarranno a disposizione solamente nella dashboard
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle" className="">
            Titolo form interno
          </FieldLabel>
          <Input
            value={baseForm.title}
            onChange={(e) =>
              setBaseForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </Field>
        <Field className="mt-4">
          <FieldLabel htmlFor="field.fieldTitle">Status form</FieldLabel>
          <Select
            defaultValue="draft"
            value={baseForm.status}
            onValueChange={(status: "draft" | "online" | "offline") =>
              setBaseForm((prev) => ({ ...prev, status: status }))
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
          value={baseForm.note}
          onChange={(e) =>
            setBaseForm((prev) => ({ ...prev, note: e.target.value }))
          }
          className=""
        ></Textarea>
      </Field>
    </div>
  );
}
