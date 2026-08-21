import type { contentForm } from "@/types/formType";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type formProps = {
  contentForm: contentForm;
};
export default function Form({ contentForm }: formProps) {
  return <form>
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
                          required
                          id={field.fieldTitle}
                          name={field.fieldTitle}
                          className="border-2 border-indigo-300"
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
                          {field.fieldNote != "null" ? field.fieldNote : null}
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
                                className="border border-indigo-300"
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
                          {field.fieldNote != "null" ? field.fieldNote : null}
                        </FieldDescription>
                        <RadioGroup
                          defaultValue={field.options[0].optionName}
                          className="w-fit"
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
  </form>;
}
