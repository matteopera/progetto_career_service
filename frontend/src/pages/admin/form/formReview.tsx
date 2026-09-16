import Form from "@/components/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { contentForm, form } from "@/types/formType";
import axios from "axios";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export default function FormReview({
  form,
  setForm,
  goToStep,
}: {
  form: Omit<form, "lastEdit" | "created">;
  setForm: Dispatch<SetStateAction<Omit<form, "lastEdit" | "created">>>;
  goToStep: (index: number) => void;
}) {
  const [isSending, setIsSending] = useState<boolean>(false);

  const saveForm = async () => {
    try {
      setIsSending(true);
      await axios.post("/api/form/insert-update-form", {
        form: form,
      });

      toast.success("Form creato con successo!");
      localStorage.removeItem("formInCostruzione");

      goToStep(3);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            error.response.data?.message || "Errore durante la creazione",
          );
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border shadow rounded-xl mt-8 p-4">
      <div className="flex justify-between mb-4">
        <Button
          disabled={isSending}
          onClick={() => goToStep(1)}
          className="px-4 h-10!"
        >
          <ChevronLeft />
          <span>Vai allo step precedente</span>
        </Button>
        <h1 className="font-semibold text-2xl">Revisione finale form</h1>
        <Button disabled={isSending} onClick={saveForm} className="px-4 h-10!">
          {isSending ? (
            <>
              <span>
                {form._id ? "Aggiornamento" : "Creazione"} in corso...
              </span>
              <Loader2 className="w-5 h-5 animate-spin" />
            </>
          ) : (
            <>
              <span>
                Conferma {form._id ? "aggiornamento" : "creazione"} form
              </span>
              <Check />
            </>
          )}
        </Button>
      </div>

      <FieldGroup>
        <p className="border-gray-400 border p-3 font-normal border-l-3 border-l-gray-400">
          {form.content.formTitle}
        </p>
        <p className="border-gray-400 border p-3 font-normal border-l-3 border-l-gray-400">
          {form.content.formNote}
        </p>
        {form.content.sections.map((section, index) => {
          return (
            <div
              id={section.sectionTitle}
              key={section.sectionTitle}
              className="border border-gray-400 p-4 border-l-2"
            >
              <div className="flex flex-row items-center mb-2">
                <FieldLegend className="rounded-full w-8 h-8 bg-blue-300 p-2 flex items-center justify-center ">
                  {index + 1}
                </FieldLegend>
                <FieldLegend className="pl-3 pr-3 font-semibold text-black">
                  {section.sectionTitle}
                </FieldLegend>
              </div>
              {section.sectionNote != "" && section.sectionNote != "null" ? (
                <FieldDescription className="p-3 border border-l-2 border-gray-400 border-l-blue-500 mb-2">
                  {section.sectionNote}
                </FieldDescription>
              ) : null}
              <div className="mb-5 sm:columns-2">
                {section.fields.map((field) => {
                  {
                    if (field.fieldType == "text") {
                      return (
                        <Field
                          className="break-inside-avoid-column mb-3"
                          key={`${section.sectionTitle}-${field.fieldTitle}`}
                        >
                          <FieldLabel
                            htmlFor="field.fieldTitle"
                            className="font-medium"
                          >
                            {field.fieldTitle}
                          </FieldLabel>
                          <Input
                            required
                            id={field.fieldTitle}
                            name={field.fieldTitle}
                            className="rounded-sm border-gray-400 font-normal text-sm"
                          />
                        </Field>
                      );
                    } else if (field.fieldType == "check") {
                      return (
                        <Field
                          className="break-inside-avoid-column mb-3"
                          key={`${section.sectionTitle}-${field.fieldTitle}`}
                        >
                          <FieldLabel className="font-medium">
                            {field.fieldTitle}
                          </FieldLabel>
                          <FieldDescription>
                            {field.fieldNote !== "" &&
                            field.fieldNote !== "null"
                              ? field.fieldNote
                              : null}
                          </FieldDescription>
                          {field.options.map((option) => {
                            return (
                              <Field
                                orientation="horizontal"
                                key={`${field.fieldTitle}-${option.optionName}`}
                              >
                                <Checkbox
                                  id={`${field.fieldTitle}-${option.optionName}`}
                                  name={option.optionName}
                                  className="border border-gray-400"
                                />
                                <FieldContent>
                                  <FieldLabel
                                    htmlFor={`${field.fieldTitle}-${option.optionName}`}
                                  >
                                    {option.optionName}
                                  </FieldLabel>
                                  <FieldDescription>
                                    {option.optionNote !== "" &&
                                    option.optionNote !== "null"
                                      ? option.optionNote
                                      : null}
                                  </FieldDescription>
                                </FieldContent>
                              </Field>
                            );
                          })}
                        </Field>
                      );
                    } else if (field.fieldType == "radio") {
                      return (
                        <Field
                          className="mb-3 break-inside-avoid-column"
                          key={`${section.sectionTitle}-${field.fieldTitle}`}
                        >
                          <FieldLabel className="font-medium">
                            {field.fieldTitle}
                          </FieldLabel>
                          <FieldDescription>
                            {field.fieldNote != "" ? field.fieldNote : null}
                          </FieldDescription>
                          <RadioGroup className="w-fit">
                            {field.options.map((option) => {
                              return (
                                <div
                                  className=" flex justify-start gap-5 rounded-sm items-center border-gray-400 border p-2"
                                  key={`${field.fieldTitle}-${option.optionName}`}
                                >
                                  <RadioGroupItem
                                    value={option.optionName}
                                    id={`${field.fieldTitle}-${option.optionName}`}
                                    className="border border-indigo-300"
                                  />
                                  <FieldLabel
                                    htmlFor={`${field.fieldTitle}-${option.optionName}`}
                                    className="flex flex-col w-full items-start gap-0"
                                  >
                                    {option.optionName}
                                    <FieldDescription>
                                      {option.optionNote}
                                    </FieldDescription>
                                  </FieldLabel>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </Field>
                      );
                    } else {
                      return null;
                    }
                  }
                })}
              </div>
            </div>
          );
        })}
      </FieldGroup>
    </div>
  );
}
