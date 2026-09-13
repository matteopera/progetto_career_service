import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import type { form } from "@/types/formType";
import axios from "axios";
import {
  CircleAlert,
  Download,
  EllipsisVertical,
  Folder,
  FolderArchive,
  Loader2,
  Plus,
  Table2,
} from "lucide-react";
import { Select } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Companies() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }
  if (!session || !session.user) {
    return <Navigate to={"/login"} />;
  }

  const [isLoadingForms, setIsLoadingForms] = useState<boolean>(true);
  const [isErrorForms, setIsErrorForms] = useState<boolean>(false);
  const [forms, setForms] = useState<form[]>([]);

  const [isLoadingCompiledForms, setIsLoadingCompiledForms] =
    useState<boolean>(true);
  const [isErrorCompiledForms, setIsErrorCompiledForms] =
    useState<boolean>(false);

  const [compiledForms, setCompiledForms] = useState<any[]>([]);

  const [selectedForm, setSelectedForm] = useState<form | null>(null);

  useEffect(() => {
    getForms();
  }, []);

  const getForms = async () => {
    try {
      const response = await axios.get("/api/form/get-all");
      const forms = response.data.forms;
      // Le date sono stringhe devo trasformarle in Date
      setForms(
        forms.map((form: any) => ({
          ...form,
          created: new Date(form.created),
          lastEdit: new Date(form.lastEdit),
        })),
      );
    } catch (error) {
      setIsErrorForms(true);
    } finally {
      setIsLoadingForms(false);
    }
  };

  const getCompiledForms = async () => {
    try {
      setIsErrorCompiledForms(false);
      setIsLoadingCompiledForms(true);
      const response = await axios.get("/api/form/get-compiled-forms/1");
      const compiledFormsRes = response.data.compiledForms;
      // Le date sono stringhe devo trasformarle in Date
      setCompiledForms(
        compiledFormsRes.map((form: any) => ({
          ...form,
          created: new Date(form.created),
          lastEdit: new Date(form.lastEdit),
        })),
      );
    } catch (error) {
      setIsErrorCompiledForms(true);
    } finally {
      setIsLoadingCompiledForms(false);
    }
  };

  const toStringDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (selectedForm) {
      getCompiledForms();
    } else {
      setIsLoadingCompiledForms(false);
    }
  }, [selectedForm]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-3xl">Aziende</h1>
      <p className="text-sm text-gray-500">
        Esplora i dati delle aziende ricevute
      </p>

      <div className="flex gap-4 my-4 ">
        <Select
          onValueChange={(value) => {
            setSelectedForm(forms.findLast((f) => f._id === value) ?? null);
          }}
        >
          <SelectTrigger className="w-full h-11!">
            <SelectValue placeholder="Seleziona un form" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {forms.map((form) => (
                <SelectItem value={form._id}>
                  {form.title} - {form.note}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Tabella ultime aziende */}
      <div className="border shadow rounded-xl h-full mt-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-xl">Le aziende registrate</h1>
          {compiledForms.length > 0 && (
            <div>
              <Button>
                <Table2 />
                Esporta dati in Excel
              </Button>
              <Button className="ml-4">
                <FolderArchive />
                Scarica tutti i PDF
              </Button>
            </div>
          )}
        </div>
        {isLoadingCompiledForms ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : isErrorCompiledForms ? (
          <div className="mt-4 bg-red-100 p-4 text-red-600 rounded-xl text-center flex gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è stato possibile recuperare i form compilati. Riprovare più
              tardi
            </p>
          </div>
        ) : selectedForm === null ? (
          <div className="bg-blue-100 mt-4 flex w-full p-4 text-blue-600 rounded-xl text-center gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Selezionare prima un form per visualizzare le risposte ricevute
            </p>
          </div>
        ) : compiledForms.length === 0 ? (
          <div className="bg-gray-100 mt-4 flex w-full p-4 text-gray-600 rounded-xl text-center gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è presente nessun form. Crea il tuo primo form subito!
            </p>
          </div>
        ) : (
          <div className="mx-4">
            {}
            <FieldGroup>
              <p className="border-gray-400 border p-3 font-normal border-l-3 border-l-gray-400">
                {selectedForm.content.formTitle}
              </p>
              <p className="border-gray-400 border p-3 font-normal border-l-3 border-l-gray-400">
                {selectedForm.content.formNote}
              </p>
              {selectedForm.content.sections.map((section, index) => {
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
                                  {field.fieldNote != ""
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
                                  {field.fieldNote != ""
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
        )}
      </div>
    </div>
  );
}
