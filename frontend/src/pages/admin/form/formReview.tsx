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
        {form.content.formNote === "" ||
        form.content.formNote === "null" ? null : (
          <p className="border rounded-2xl border-gray-100 p-3 bg-gray-100 font-semibold ">
            {form.content.formNote}
          </p>
        )}
        {form.content.sections.map((section, index) => {
          return (
            <div
              id={section.sectionTitle}
              key={section.sectionTitle}
              className=""
            >
              <div className="flex flex-row items-center p-3 pl-5 rounded-tl-2xl rounded-tr-2xl bg-gray-100">
                <p className="font-bold">{`Sezione ${index + 1} · ${section.sectionTitle}`}</p>
              </div>
              {section.sectionNote !== "null" && section.sectionNote !== "" ? (
                <FieldDescription className=" pl-5 pr-5 pt-3  border-2 border-b-0 border-gray-100">
                  {section.sectionNote}
                </FieldDescription>
              ) : null}
              <div className="mb-5 sm:columns-2 p-3 pl-5 pr-5 border-l-2 border-r-2 border-b-2 rounded-bl-2xl rounded-br-2xl border-gray-100">
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
                            className="rounded-sm border-gray-100 border-2 font-normal text-sm"
                          ></Input>
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
                            {field.fieldNote !== "null" &&
                            field.fieldNote !== ""
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
                                    {option.optionNote !== "null" &&
                                    option.optionNote !== ""
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
                            {field.fieldNote !== "null" &&
                            field.fieldNote !== ""
                              ? field.fieldNote
                              : null}
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
                                    className="border border-gray-300"
                                  />
                                  <FieldLabel
                                    htmlFor={`${field.fieldTitle}-${option.optionName}`}
                                    className="flex flex-col w-full items-start gap-0"
                                  >
                                    {option.optionName}
                                    {option.optionNote === "null" ? null : (
                                      <FieldDescription>
                                        {option.optionNote}
                                      </FieldDescription>
                                    )}
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
