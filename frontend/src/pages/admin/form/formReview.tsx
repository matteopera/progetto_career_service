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
import type { contentForm } from "@/types/formType";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function FormReview({
  sectionsForm,
  baseForm,
  goToStep,
}: {
  sectionsForm: Pick<contentForm, "sections">;
  baseForm: {
    formTitle: string;
    formNote: string;
    formSubtitle: string;
    title: string;
    note: string;
    status: "draft" | "online" | "offline";
  };
  goToStep: (index: number) => void;
}) {
  const form: contentForm = {
    ...baseForm,
    sections: sectionsForm.sections,
    date: new Date(),
  };

  const saveForm = async () => {
    const response = await fetch("/api/form/insert-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: form }),
    });

    if (!response.ok) {
      const json = await response.json();
      toast.error(json);
      return;
    }

    toast.success("Form creato con successo!");
    localStorage.setItem("formInCostruzioneBase", "");
    localStorage.setItem("formInCostruzioneContent", "");

    goToStep(3);
  };
  return (
    <div className="border shadow rounded-xl mt-8 p-4">
      <div className="flex justify-between mb-4">
        <Button onClick={() => goToStep(1)} className="px-4 h-10!">
          <ChevronLeft />
          <span>Vai allo step precedente</span>
        </Button>
        <h1 className="font-semibold text-2xl">Preview del tuo form</h1>
        <Button onClick={saveForm} className="px-4 h-10!">
          <span>Conferma creazione form</span>
          <Check />
        </Button>
      </div>

      <FieldGroup>
        <p className="border-gray-400 border p-3 font-normal border-l-3 border-l-gray-400">
          {form.formTitle}
        </p>
        <p className="border-gray-400 border p-3 font-normal border-l-3 border-l-gray-400">
          {form.formNote}
        </p>
        {form.sections.map((section, index) => {
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
              {section.sectionNote != "" ? (
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
                            {field.fieldNote != "" ? field.fieldNote : null}
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
                                    {option.optionNote != ""
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
