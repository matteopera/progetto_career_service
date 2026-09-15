import { Button } from "@/components/ui/button";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import type { form } from "@/types/formType";
import axios from "axios";
import { CircleAlert, FolderArchive, Loader2, Table2 } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

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

  // Gestione forms
  const [isLoadingForms, setIsLoadingForms] = useState<boolean>(true);
  const [isErrorForms, setIsErrorForms] = useState<boolean>(false);
  const [forms, setForms] = useState<form[]>([]);

  // Stato form selezionato da visualizzare i dati
  const [selectedForm, setSelectedForm] = useState<form | null>(null);

  // Gestione form compilati
  const [isLoadingCompiledForms, setIsLoadingCompiledForms] =
    useState<boolean>(true);
  const [isErrorCompiledForms, setIsErrorCompiledForms] =
    useState<boolean>(false);
  const [compiledForms, setCompiledForms] = useState<any[]>([]);

  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);

  useEffect(() => {
    if (session.user) getForms();
  }, [session]);

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
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            error.response.data?.message ||
              "Errore durante il recupero dei form",
          );
        }
      }
      setIsErrorForms(true);
    } finally {
      setIsLoadingForms(false);
    }
  };

  const getCompiledForms = async () => {
    try {
      setIsErrorCompiledForms(false);
      setIsLoadingCompiledForms(true);
      const response = await axios.get(
        `/api/form/get-compiled-forms/${selectedForm?._id}`,
      );
      const compiledFormsRes = response.data.compiledForms;

      setCompiledForms(compiledFormsRes);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            error.response.data?.message ||
              "Errore durante il recupero dei form compilati",
          );
        }
      }
      setIsErrorCompiledForms(true);
    } finally {
      setIsLoadingCompiledForms(false);
    }
  };

  // Gestione PDF
  const getPdfCompany = async (id: string) => {
    setIsDownloadingPDF(true);
    try {
      const response = await axios.post(
        "/api/pdf/download-compiled-form",
        {
          idCompiledForm: id,
        },
        { responseType: "blob" },
      );
      var url = window.URL.createObjectURL(response.data);
      var a = document.createElement("a");
      a.href = url;
      a.download = `${id}.pdf`;
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success("PDF scaricato con successo");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const jsonString = await error.response.data.text();
          const json = JSON.parse(jsonString);
          toast.error(json.message || "Errore durante il download del PDF");
        }
      }
    }
    setIsDownloadingPDF(false);
  };

  const getAllPdf = async (idForm: string) => {
    setIsDownloadingPDF(true);
    try {
      const response = await axios.post(
        "/api/pdf/download-compiled-forms",
        {
          idForm: idForm,
        },
        { responseType: "blob" },
      );
      var url = window.URL.createObjectURL(response.data);
      var a = document.createElement("a");
      a.href = url;
      a.download = `${idForm}.zip`;
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success("ZIP scaricato con successo");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const jsonString = await error.response.data.text();
          const json = JSON.parse(jsonString);
          toast.error(json.message || "Errore durante il download dello ZIP");
        }
      }
    }
    setIsDownloadingPDF(false);
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
            <SelectValue
              placeholder={`${isLoadingForms ? "Caricamento form in corso..." : isErrorForms ? "Non è stato possibile caricare i form" : "Seleziona un form"}`}
            />
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
              <Button
                className="ml-4"
                onClick={() => getAllPdf(selectedForm!._id)}
                disabled={isDownloadingPDF}
              >
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
              Non è presente nessuna compilazione
            </p>
          </div>
        ) : (
          <div className="mx-4 flex flex-col gap-8 ">
            {compiledForms.map((compiledForm, index) => (
              <div className="border gap-4 p-4 shadow rounded-xl flex flex-col ">
                <div className="flex items-center gap-2 border-b pb-4">
                  <div className="bg-black w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl font-semibold">
                    # {index + 1}
                  </div>
                  <p className="text-gray-700 text-lg ">
                    Registrazione {index + 1}
                  </p>
                  <Button
                    className="ml-auto"
                    onClick={() => getPdfCompany(compiledForm._id)}
                    disabled={isDownloadingPDF}
                  >
                    <FolderArchive />
                    Scarica PDF
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {Object.keys(compiledForm)
                    .filter(
                      (sectionName) =>
                        sectionName !== "_id" && sectionName !== "info",
                    )
                    .map((sectionName) => (
                      <div className="">
                        <p className="font-semibold text-lg border-b pb-2 mb-2">
                          {sectionName}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(compiledForm[sectionName]).map(
                            (nameField) => {
                              return (
                                <div>
                                  <div className="text-gray-600">
                                    {nameField}:{" "}
                                    <span className="text-black font-semibold">
                                      {typeof compiledForm[sectionName][
                                        nameField
                                      ] === "object" ? (
                                        <ul>
                                          {compiledForm[sectionName][
                                            nameField
                                          ].map((element: string) => (
                                            <li>{element}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        compiledForm[sectionName][nameField]
                                      )}
                                    </span>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
