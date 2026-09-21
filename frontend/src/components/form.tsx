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
  formId:string|null
};
export default function Form({ contentForm, formId }: formProps) {
  const { value, handleChange, cleanForm, sendForm, isNotValid, sendable,error } =
    useValue(contentForm);

  function toAriaInvalid(key: string) {
    return isNotValid.includes(key) && sendable;
  }
  return (
    <div>
      <form>
        <FieldGroup>
          {contentForm.formNote==="null"? null:<p className="border rounded-2xl border-gray-100 p-3 bg-gray-100 font-semibold ">
            {contentForm.formNote}
          </p>}
          {contentForm.sections.map((section, index) => {
            return (
              <div
                id={section.sectionTitle}
                key={section.sectionTitle}
                className=""
              >
                <div className="flex flex-row items-center p-3 pl-5 rounded-tl-2xl rounded-tr-2xl bg-gray-100">
                  <p className="font-bold">{`Sezione ${index+1} · ${section.sectionTitle}`}</p>
                </div>
                {section.sectionNote !== "null" ? (
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
                            <FieldDescription>
                              {field.fieldNote !== "null"
                                ? field.fieldNote
                                : null}
                            </FieldDescription>
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
                              className="rounded-sm border-gray-100 border-2 font-normal text-sm"
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
                              {field.fieldNote !== "null"
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
                                      {option.optionNote !== "null"
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
                              {field.fieldNote !== "null"
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
                                      className="border border-gray-300"
                                    />
                                      <FieldLabel
                                        htmlFor={`${field.fieldTitle}-${option.optionName}`}
                                        className="flex flex-col w-full items-start gap-0"
                                      >
                                        {option.optionName}
                                        {option.optionNote==="null"? null:<FieldDescription>
                                          {option.optionNote}
                                        </FieldDescription>}
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
      {error!==null? (
        <p className="text-red-400">
          Errore nel salvataggio del form si prega di riprovare
        </p>
      ) : null}
      <div className="gap-3 flex justify-end mb-7">
        <Button variant="destructive" size="lg" onClick={cleanForm} disabled={formId===null? false:true}>
          Svuota
        </Button>
        <Button className="bg-blue-500" size="lg" onClick={sendForm} disabled={formId===null? false:true}>
          Invia
        </Button>
      </div>
    </div>
  );
}
