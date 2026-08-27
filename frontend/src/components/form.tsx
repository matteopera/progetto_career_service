import type { contentForm } from "@/types/formType";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { useValue } from "@/hooks/useFetchForm";

type formProps = {
  contentForm: contentForm;
};
export default function Form({ contentForm }: formProps) {
  const { value, handleChange, cleanForm, sendForm, isNotValid, sendable } =
    useValue(contentForm);

  function toAriaInvalid(key: string) {
    return isNotValid.includes(key) && sendable;
  }
  return (
    <div className="ml-3 mt-7 mr-3 md:ml-7 md:mr-7">
      <form>
        <FieldGroup>
          <p className="border-gray-400 border p-3 font-normal border-l-3 border-l-gray-400">
            {contentForm.formNote}
          </p>
          {contentForm.sections.map((section, index) => {
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
                {section.sectionNote != "null" ? (
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
                              aria-invalid={toAriaInvalid(
                                `${section.sectionTitle}-${field.fieldTitle}`,
                              )}
                              required
                              id={field.fieldTitle}
                              name={field.fieldTitle}
                              value={
                                (value[section.sectionTitle]?.[
                                  field.fieldTitle
                                ] as string) ?? ""
                              }
                              className="rounded-sm border-gray-400 font-normal text-sm"
                              onChange={(e) => {
                                handleChange(
                                  section.sectionTitle,
                                  field.fieldTitle,
                                  null,
                                  e.target.value,
                                );
                              }}
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
                              {field.fieldNote != "null"
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
                                    aria-invalid={toAriaInvalid(
                                      `${section.sectionTitle}-${field.fieldTitle}`,
                                    )}
                                    id={`${field.fieldTitle}-${option.optionName}`}
                                    name={option.optionName}
                                    checked={
                                      value[section.sectionTitle]?.[
                                        field.fieldTitle
                                      ].includes(option.optionName) ?? false
                                    }
                                    className="border border-gray-400"
                                    onCheckedChange={(check) => {
                                      handleChange(
                                        section.sectionTitle,
                                        field.fieldTitle,
                                        option.optionName,
                                        check,
                                      );
                                    }}
                                  />
                                  <FieldContent>
                                    <FieldLabel
                                      htmlFor={`${field.fieldTitle}-${option.optionName}`}
                                    >
                                      {option.optionName}
                                    </FieldLabel>
                                    <FieldDescription>
                                      {option.optionNote != "null"
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
                              {field.fieldNote != "null"
                                ? field.fieldNote
                                : null}
                            </FieldDescription>
                            <RadioGroup
                              value={
                                value[section.sectionTitle]?.[
                                  field.fieldTitle
                                ] as string
                              }
                              className="w-fit"
                              onValueChange={(value) => {
                                handleChange(
                                  section.sectionTitle,
                                  field.fieldTitle,
                                  null,
                                  value,
                                );
                              }}
                            >
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
        <div className="flex justify-end mb-5 mt-5">
          <p className="font-normal text-sm">
            Vi preghiamo di prendere visione dell’informativa{" "}
            <a
              className="underline"
              href="https://www.recruitingverona.it/sites/default/files/privacy/privacy-policy-Recruiting-202204.pdf"
              target="_blank"
            >
              privacy
            </a>{" "}
            e della{" "}
            <a
              className="underline"
              href="https://www.recruitingverona.it/sites/default/files/privacy/cookie-policy-Recruiting.pdf"
              target="_blank"
            >
              cookie policy
            </a>
            .
          </p>
        </div>
      </form>
      {sendable && isNotValid.length > 0 ? (
        <p className="text-red-400">
          Si prega di riempire correttamente tutti i campi
        </p>
      ) : null}
      <div className="gap-3 flex justify-end mb-7">
        <Button variant="destructive" size="lg" onClick={cleanForm}>
          Svuota
        </Button>
        <Button className="bg-blue-500" size="lg" onClick={sendForm}>
          Invia
        </Button>
      </div>
    </div>
  );
}
