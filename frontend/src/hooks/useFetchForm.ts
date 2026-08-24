import fetchForm, { uploadCompiledForm } from "@/api/formApi";
import {
  zodCheckboxField,
  zodRadioField,
  zodTextField,
  type contentForm,
} from "@/types/formType";
import type { option } from "@/types/formType";
import { use, useEffect, useState } from "react";
import type { ZodAny } from "zod";

type useFetchFormType = {
  form: contentForm | null;
  isLoading: boolean;
  error: Error | null;
};
export default function useFetchForm(): useFetchFormType {
  const [form, setForm] = useState<contentForm | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    //fetchign form from DB
    fetchForm()
      .then((data) => {
        setForm(data);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { form, isLoading, error };
}

export type value = Record<string, Record<string, string | string[]>>;

function initialValue(form: contentForm) {
  const firstValue: value = {};
  const fieldTypeMap: Record<string, string> = {};
  const checkboxListMap: Record<string, string[]> = {};
  form.sections.forEach((section) => {
    firstValue[section.sectionTitle] = {};
    section.fields.forEach((field) => {
      const resultTextParse = zodTextField.safeParse(field);
      if (resultTextParse.success) {
        firstValue[section.sectionTitle][field.fieldTitle] = "";
        fieldTypeMap[`${section.sectionTitle}-${field.fieldTitle}`] = "text";
      }
      const resultCheckboxParse = zodCheckboxField.safeParse(field);
      if (resultCheckboxParse.success) {
        firstValue[section.sectionTitle][field.fieldTitle] = [];
        fieldTypeMap[`${section.sectionTitle}-${field.fieldTitle}`] = "check";
        checkboxListMap[`${section.sectionTitle}-${field.fieldTitle}`] = [];
      }
      const resultRadioParse = zodRadioField.safeParse(field);
      if (resultRadioParse.success) {
        const options: option[] = resultRadioParse.data.options;
        const firstOption = options[0].optionName;
        firstValue[section.sectionTitle][field.fieldTitle] = firstOption;
        fieldTypeMap[`${section.sectionTitle}-${field.fieldTitle}`] = "radio";
      }
    });
  });
  return { firstValue, fieldTypeMap, checkboxListMap };
}

export function useValue(form: contentForm) {
  const [value, setValue] = useState<value>({});
  const [fieldTypeMap, setFieldTypeMap] = useState<Record<string, string>>({});
  const [checkboxListMap, setCheckboxListMap] = useState<
    Record<string, string[]>
  >({});
  //generazione del prima value

  useEffect(() => {
    const { firstValue, fieldTypeMap, checkboxListMap } = initialValue(form);
    setValue(firstValue);
    setFieldTypeMap(fieldTypeMap);
    setCheckboxListMap(checkboxListMap);
  }, [form]);
  function handleChange(
    sectionTitle: string,
    fieldTitle: string,
    optionName: string | null,
    newValue: string | boolean,
  ) {
    if (fieldTypeMap[`${sectionTitle}-${fieldTitle}`] == "text") {
      //it's a text field
      setValue((oldValue) => {
        const updated = {
          ...oldValue,
          [sectionTitle]: { ...oldValue[sectionTitle], [fieldTitle]: newValue },
        };
        console.log(updated);
        return updated;
      });
    }
    if (fieldTypeMap[`${sectionTitle}-${fieldTitle}`] == "check") {
      console.log("Entro qui dentro");
      //it's a checkbox field
      const oldList = checkboxListMap[`${sectionTitle}-${fieldTitle}`];
      if (newValue === true) {
        const newList =
          optionName != null ? oldList.concat([optionName]) : oldList;

        setValue((oldValue) => {
          const updated = {
            ...oldValue,
            [sectionTitle]: {
              ...oldValue[sectionTitle],
              [fieldTitle]: newList,
            },
          };
          console.log(updated);
          return updated;
        });
        //updating the map
        const newCheckboxListMap = checkboxListMap;
        newCheckboxListMap[`${sectionTitle}-${fieldTitle}`] = newList;
        setCheckboxListMap(newCheckboxListMap);
      }
      if (newValue === false) {
        const newList = oldList.filter((item) => {
          return item !== optionName;
        });
        console.log(`La nuova lista è ${newList}`);
        setValue((oldValue) => {
          const updated = {
            ...oldValue,
            [sectionTitle]: {
              ...oldValue[sectionTitle],
              [fieldTitle]: newList,
            },
          };
          console.log(updated);
          return updated;
        });

        //updating the map
        const newCheckboxListMap = checkboxListMap;
        newCheckboxListMap[`${sectionTitle}-${fieldTitle}`] = newList;
        setCheckboxListMap(newCheckboxListMap);
      }
    }
    if (fieldTypeMap[`${sectionTitle}-${fieldTitle}`] == "radio") {
      setValue((oldValue) => {
        const updated = {
          ...oldValue,
          [sectionTitle]: { ...oldValue[sectionTitle], [fieldTitle]: newValue },
        };
        console.log(updated);
        return updated;
      });
    }

    //destrutturazione
    console.log(newValue);
    //aggiornamento del valore
  }

  function cleanForm() {
    const { firstValue, fieldTypeMap, checkboxListMap } = initialValue(form);
    setValue(firstValue);
    setFieldTypeMap(fieldTypeMap);
    setCheckboxListMap(checkboxListMap);

    console.log("Ho provato a svuotare");
  }

  function sendForm() {
    uploadCompiledForm(value)
  }
  return { value, handleChange, cleanForm, sendForm };
}
