import fetchForm, { uploadCompiledForm } from "@/api/formApi";
import {
  zodCheckboxField,
  zodCodiceFiscale,
  zodEmail,
  zodPIVA,
  zodRadioField,
  zodTel,
  zodTextField,
  type contentForm,
} from "@/types/formType";
import type { option } from "@/types/formType";
import { use, useEffect, useState } from "react";
import type { textField } from "@/types/formType";
import type { ZodAny } from "zod";
import z from "zod";
import { useNavigate } from "react-router";

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

/**
 * 
 * @param form it's the form fetched from the db
 * @returns an object composed by the value to give to the states that handle the validation and the render of the compiled form
 */
function initialValue(form: contentForm) {
  const firstValue: value = {};
  const fieldTypeMap: Record<string, string> = {};
  const checkboxListMap: Record<string, string[]> = {};
  const textType: Record<string, string> = {};
  const isNotValid: string[] = [];
  form.sections.forEach((section) => {
    firstValue[section.sectionTitle] = {};
    section.fields.forEach((field) => {
      const resultTextParse = zodTextField.safeParse(field);
      if (resultTextParse.success) {
        firstValue[section.sectionTitle][field.fieldTitle] = "";
        fieldTypeMap[`${section.sectionTitle}-${field.fieldTitle}`] = "text";
        textType[`${section.sectionTitle}-${field.fieldTitle}`] = (
          field as textField
        ).textType;
        isNotValid.push(`${section.sectionTitle}-${field.fieldTitle}`);
      }
      const resultCheckboxParse = zodCheckboxField.safeParse(field);
      if (resultCheckboxParse.success) {
        firstValue[section.sectionTitle][field.fieldTitle] = [];
        fieldTypeMap[`${section.sectionTitle}-${field.fieldTitle}`] = "check";
        checkboxListMap[`${section.sectionTitle}-${field.fieldTitle}`] = [];
        isNotValid.push(`${section.sectionTitle}-${field.fieldTitle}`);
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
  return { firstValue, fieldTypeMap, checkboxListMap, textType, isNotValid };
}
/**
 * 
 * @param form it's the form fetched from the db
 * @returns an object of functions that are defined in this component in order to give access to the states to the UI
 */
export function useValue(form: contentForm) {
  const [value, setValue] = useState<value>({});
  const [fieldTypeMap, setFieldTypeMap] = useState<Record<string, string>>({});
  const [checkboxListMap, setCheckboxListMap] = useState<
    Record<string, string[]>
  >({});
  const [isNotValid, setIsNotValid] = useState<string[]>([]);
  const [textType, setTextType] = useState<Record<string, string>>({});
  const [sendable, setSendable] = useState<boolean>(false);
  const navigate=useNavigate()
  //generazione del prima value

  useEffect(() => {
    const { firstValue, fieldTypeMap, checkboxListMap, textType, isNotValid } =
      initialValue(form);
    setValue(firstValue);
    setFieldTypeMap(fieldTypeMap);
    setCheckboxListMap(checkboxListMap);
    setTextType(textType);
    setIsNotValid(isNotValid);
  }, [form]);

  /**
   * This function handle the change of the UI to change the inputs fields and to perform the validation of data
   * 
   * @description The function receive the data from the UI in order to check the validity of data, update the isNotValid state and to update the value state that will be sent to the server
   * @param sectionTitle refers to the title of the section that contains the field inside the online form fetched from the db
   * @param fieldTitle refers to the title of the field that is given in the form to this data
   * @param optionName if the field is a checkbox or a radio field optionName is the value of the option that has been checked. If the field is a classic textField optionName is null
   * @param newValue it's the newValue of the field. For a text field it represents the value writtend in the input field, for a checkbox it's true or false, depending on the check, for the radiobox it's the value of the new checked option
   */
  function handleChange(
    sectionTitle: string,
    fieldTitle: string,
    optionName: string | null,
    newValue: string | boolean,
  ) {
    if (sendable) {
      setSendable(false);
    }
    const key=`${sectionTitle}-${fieldTitle}`;
    if (fieldTypeMap[key] == "text") {
      if (textType[key] === "CF") {
        //controllo per il cf
        const res = zodCodiceFiscale.safeParse(newValue);
        if (!res.success) {
            setIsNotValid((oldValue) => {
              if(oldValue.includes(key)) return oldValue
              const newValue = oldValue.concat(
                key,
              );
              
              return newValue;
            });
          } else {
          setIsNotValid((oldValue) => {
            const newValue = oldValue.filter((s) => {
              return s !== key;
            });
             (newValue);
            return newValue;
          });
        }
      }
      if (textType[key] === "P.IVA") {
        //controllo per la partita iva
        const res = zodPIVA.safeParse(newValue);
        if (!res.success) {
            setIsNotValid((oldValue) => {
              if(oldValue.includes(key)) return oldValue
              const newValue = oldValue.concat(
                key,
              );
               (newValue);
              return newValue;
            });
          } else {
          setIsNotValid((oldValue) => {
            const newValue = oldValue.filter((s) => {
              return s !== key;
            });
             (newValue);
            return newValue;
          });
        }
      }
      if (textType[key] === "email") {
        //controllo per la mail
         (zodEmail.safeParse("m").success); // dovrebbe stampare "false"
        const res = zodEmail.safeParse(newValue);
        if (!res.success) {
            setIsNotValid((oldValue) => {
              if(oldValue.includes(key)) return oldValue
              const newValue = oldValue.concat(
                key,
              );
               (newValue);
              return newValue;
            });
          } else {
          setIsNotValid((oldValue) => {
            const newValue = oldValue.filter((s) => {
              return s !== key;
            });
             (newValue);
            return newValue;
          });
        }
      }
      if (textType[key] === "tel") {
        //controllo per il tel
        const res = zodTel.safeParse(newValue);
        if (!res.success) {
            setIsNotValid((oldValue) => {
              if(oldValue.includes(key)) return oldValue
              const newValue = oldValue.concat(
                key,
              );
               (newValue);
              return newValue;
            });
          } else {
          setIsNotValid((oldValue) => {
            const newValue = oldValue.filter((s) => {
              return s !== key;
            });
             (newValue);
            return newValue;
          });
        }
      }
      if (textType[key] === "text") {
        //controllo per il tel
        if ((newValue as string).length===0) {
            setIsNotValid((oldValue) => {
              if(oldValue.includes(key)) return oldValue
              const newValue = oldValue.concat(
                key,
              );
               (newValue);
              return newValue;
            });
          } else {
          setIsNotValid((oldValue) => {
            const newValue = oldValue.filter((s) => {
              return s !== key;
            });
             (newValue);
            return newValue;
          });
        }
      }
      //it's a text field
      setValue((oldValue) => {
        const updated = {
          ...oldValue,
          [sectionTitle]: { ...oldValue[sectionTitle], [fieldTitle]: newValue },
        };

        return updated;
      });
    }
    if (fieldTypeMap[key] == "check") {
      //it's a checkbox field
      const oldList = checkboxListMap[key];
      if (newValue == true) {
        const newList =
          optionName != null ? oldList.concat([optionName]) : oldList;

        if (newList.length===0) {
            setIsNotValid((oldValue) => {
              if(oldValue.includes(key)) return oldValue
              const newValue = oldValue.concat(
                key,
              );
               (newValue);
              return newValue;
            });
          } else {
          setIsNotValid((oldValue) => {
            const newValue = oldValue.filter((s) => {
              return s !== key;
            });
             (newValue);
            return newValue;
          });
        }
        setValue((oldValue) => {
          const updated = {
            ...oldValue,
            [sectionTitle]: {
              ...oldValue[sectionTitle],
              [fieldTitle]: newList,
            },
          };
          return updated;
        });
        //updating the map
        const newCheckboxListMap = checkboxListMap;
        newCheckboxListMap[key] = newList;
        setCheckboxListMap(newCheckboxListMap);
      }
      if (newValue === false) {
        const newList = oldList.filter((item) => {
          return item !== optionName;
        });
        if (newList.length===0) {
            setIsNotValid((oldValue) => {
              if(oldValue.includes(key)) return oldValue
              const newValue = oldValue.concat(
                key,
              );
               (newValue);
              return newValue;
            });
          } else {
          setIsNotValid((oldValue) => {
            const newValue = oldValue.filter((s) => {
              return s !== key;
            });
             (newValue);
            return newValue;
          });
        }
        setValue((oldValue) => {
          const updated = {
            ...oldValue,
            [sectionTitle]: {
              ...oldValue[sectionTitle],
              [fieldTitle]: newList,
            },
          };
          return updated;
        });

        //updating the map
        const newCheckboxListMap = checkboxListMap;
        newCheckboxListMap[key] = newList;
        setCheckboxListMap(newCheckboxListMap);
      }
    }
    if (fieldTypeMap[key] == "radio") {
      setValue((oldValue) => {
        const updated = {
          ...oldValue,
          [sectionTitle]: { ...oldValue[sectionTitle], [fieldTitle]: newValue },
        };
        return updated;
      });
    }
  }

  /**
   * Function called from sendForm() in order to check the validity of the data
   * 
   * @description The data is checked at every change and if it is not valid its section and field are added to the isNotValid state. This function controll if the isNotValid list is empty
   * @returns true if the data follows the required structure, false otherwise
   */
  function formValidityCheck() {
    //devo iterare su ogni campo del compiledForm come per l'handle change
    //check della lista
    if (isNotValid.length > 0) {
      return false;
    }
    return true;
  }

  /**
   * Function called from the "Svuota" button to clean the form
   * 
   * @description The function starts by calling the initialValue function, used to clean the value state and all the data structure with dependency from it. After that it assings again the value to the reletive states
   */
  function cleanForm() {
    const { firstValue, fieldTypeMap, checkboxListMap } = initialValue(form);
    setValue(firstValue);
    setFieldTypeMap(fieldTypeMap);
    setCheckboxListMap(checkboxListMap);
    setSendable(false)
  }


  /**
   * Function called from the "Invia" button to upload the compiled form into the db
   * 
   * @description The function check the validity of the data used to fill the form (for example CF, email, tel ecc. structer). After the correct validation the compiled form is sent to the server
   */
  function sendForm() {
    if (formValidityCheck()) {
      uploadCompiledForm(value).then((res)=>{
        console.log(res)
        if(res.ok){
        navigate("/company/pdf",{ replace: true })
      }
      else{
        setSendable(true)
      }
      }).catch((error)=>{
        //display pagina di errore
        console.error(`Errore:${error}`)
      })
      
    }
    setSendable(true);
  }
  return { value, handleChange, cleanForm, sendForm, isNotValid, sendable };
}
