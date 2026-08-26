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
    return isNotValid.includes(key) &&
      sendable;
  }
  return (
    <div>
      <form>
        <FieldGroup>
          <p>{contentForm.formNote}</p>
          {contentForm.sections.map((section) => {
            return (
              <FieldSet key={section.sectionTitle}>
                <FieldLegend>{section.sectionTitle}</FieldLegend>
                {section.sectionNote != "null" ? (
                  <FieldDescription>{section.sectionNote}</FieldDescription>
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
                            <FieldLabel htmlFor="field.fieldTitle">
                              {field.fieldTitle}
                            </FieldLabel>
                            <Input
                              aria-invalid={toAriaInvalid(`${section.sectionTitle}-${field.fieldTitle}`)}
                              required
                              id={field.fieldTitle}
                              name={field.fieldTitle}
                              value={
                                (value[section.sectionTitle]?.[
                                  field.fieldTitle
                                ] as string) ?? ""
                              }
                              className="border-2 border-indigo-300"
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
                            <FieldLabel>{field.fieldTitle}</FieldLabel>
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
                                    aria-invalid={
                                      toAriaInvalid(`${section.sectionTitle}-${field.fieldTitle}`)
                                    }
                                    id={`${field.fieldTitle}-${option.optionName}`}
                                    name={option.optionName}
                                    checked={
                                      value[section.sectionTitle]?.[
                                        field.fieldTitle
                                      ].includes(option.optionName) ?? false
                                    }
                                    className="border border-indigo-300"
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
                            <FieldLabel>{field.fieldTitle}</FieldLabel>
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
                                    className="flex gap-3 items-center"
                                    key={`${field.fieldTitle}-${option.optionName}`}
                                  >
                                    <RadioGroupItem
                                      value={option.optionName}
                                      id={`${field.fieldTitle}-${option.optionName}`}
                                      className="border border-indigo-300"
                                    />
                                    <FieldLabel
                                      htmlFor={`${field.fieldTitle}-${option.optionName}`}
                                    >
                                      {option.optionName}
                                    </FieldLabel>
                                    <FieldDescription>
                                      {option.optionNote}
                                    </FieldDescription>
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
              </FieldSet>
            );
          })}
        </FieldGroup>
        <div className="flex justify-end mb-5">
          <p>
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
      <div className="gap-3 flex justify-end">
        <Button variant="destructive" size="lg" onClick={cleanForm}>
          Svuota
        </Button>
        <Button className="bg-indigo-300" size="lg" onClick={sendForm}>
          Invia
        </Button>
      </div>
    </div>
  );
}
