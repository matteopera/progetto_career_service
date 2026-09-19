import { Button } from "@/components/ui/button";
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
  Calendar,
  CircleAlert,
  Database,
  ExternalLink,
  FormIcon,
  Loader2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { toast } from "sonner";

export default function Dashboard() {
  // Controllo sessione
  const { data: session, isPending } = authClient.useSession();

  // Gestione stati dati card
  const [isLoadingCardData, setIsLoadingCardData] = useState<boolean>(true);
  const [isErrorCardData, setIsErrorCardData] = useState<boolean>(false);
  const [cardData, setCardData] = useState<
    {
      id: number;
      name: string;
      value: string;
      icon: LucideIcon;
    }[]
  >([]);

  // Gestione stati ultime risposte dei form
  const [isLoadingLastCompiledForms, setIsLoadingLastCompiledForms] =
    useState<boolean>(true);
  const [isErrorLastCompiledForms, setIsErrorLastCompiledForms] =
    useState<boolean>(false);
  const [lastCompiledForms, setLastCompiledForms] = useState<any[]>([]);

  // Gestione stati ultimi form
  const [isLoadingLastForms, setIsLoadingLastForms] = useState<boolean>(true);
  const [isErrorLastForms, setIsErrorLastForms] = useState<boolean>(false);
  const [lastForms, setLastForms] = useState<form[]>([]);

  // Recupero dati dashboard
  useEffect(() => {
    if (session?.user) {
      getCardData();
      getLastForms();
      getLastCompiledForms();
    }
  }, [session]);

  const getCardData = async () => {
    try {
      const response = await axios.get("/api/form/get-data-dashboard");
      const data = response.data;

      const lastCreatedFormDate = new Date(data.lastCreatedForm.created);

      // Le date sono stringhe devo trasformarle in Date
      setCardData([
        {
          id: 1,
          name: "Form Creati",
          value: data.nrForm,
          icon: FormIcon,
        },
        {
          id: 2,
          name: "Totale Dati Raccolti",
          value: data.nrCompiledForm,
          icon: Database,
        },
        {
          id: 3,
          name: "Ultimo Form Creato",
          value: toStringDate(lastCreatedFormDate),
          icon: Calendar,
        },
        {
          id: 4,
          name: "Iscritti Prossimo Evento",
          value: data.nrCompiledFormLastEvent,
          icon: Users,
        },
      ]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            error.response.data?.message ||
              "Errore durante il recupero delle statistiche generali",
          );
        }
      }
      setIsErrorCardData(true);
    } finally {
      setIsLoadingCardData(false);
    }
  };

  const getLastCompiledForms = async () => {
    try {
      const response = await axios.get("/api/form/get-last-compiled-forms");
      const compiledFormsRes = response.data.compiledForms;
      setLastCompiledForms(compiledFormsRes);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            error.response.data?.message ||
              "Errore durante il recupero delle ultime aziende",
          );
        }
      }
      setIsErrorLastCompiledForms(true);
    } finally {
      setIsLoadingLastCompiledForms(false);
    }
  };

  const getLastForms = async () => {
    try {
      const response = await axios.get("/api/form/get-last");
      const forms = response.data.forms;
      // Le date sono stringhe devo trasformarle in Date
      setLastForms(
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
              "Errore durante il recupero degli ultimi form creati",
          );
        }
      }
      setIsErrorLastForms(true);
    } finally {
      setIsLoadingLastForms(false);
    }
  };

  const toStringDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

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

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-3xl">Dashboard</h1>
      <p className="text-sm text-gray-500">
        Una visualizzazione generale della piattaforma
      </p>

      {/* cardData */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
        {isLoadingCardData ? (
          <div className="col-span-4 flex justify-center items-center h-full">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : isErrorCardData ? (
          <div className="col-span-4 mt-4 bg-red-100 p-4 text-red-600 rounded-xl text-center flex gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è stato possibile recuperare le statistiche
            </p>
          </div>
        ) : cardData.length === 0 ? (
          <div className="col-span-4 bg-gray-100 mt-4 flex w-full p-4 text-gray-600 rounded-xl text-center gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è disponibile nessuna statistica
            </p>
          </div>
        ) : (
          <>
            {cardData.map((data) => (
              <div
                key={data.id}
                className="border flex justify-between items-start rounded-xl shadow-xs p-4 w-full"
              >
                <div className="">
                  {/* titolo */}
                  <span className="text-sm font-medium text-gray-500">
                    {data.name}
                  </span>
                  <p className="text-2xl mt-2 font-bold">{data.value}</p>
                </div>
                <div className=" shadow  rounded-lg p-4">
                  <data.icon className="text-black w-5 h-5" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Tabella ultime aziende */}
      <div className="border shadow rounded-xl h-80 mt-8 p-4 overflow-y-auto">
        <h1 className="font-medium text-xl">Ultime aziende registrate</h1>
        {isLoadingLastCompiledForms ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : isErrorLastCompiledForms ? (
          <div className="mt-4 bg-red-100 p-4 text-red-600 rounded-xl text-center flex gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è stato possibile recuperare gli ultimi form compilati.
              Riprovare più tardi
            </p>
          </div>
        ) : lastCompiledForms.length === 0 ? (
          <div className="bg-gray-100 mt-4 flex w-full p-4 text-gray-600 rounded-xl text-center gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è presente nessuna compilazione
            </p>
          </div>
        ) : (
          <>
            {lastCompiledForms.map((compiledForm, index) => (
              <div className=" gap-4 p-4 border-b flex flex-col ">
                <div className="flex items-center gap-2  pb-4">
                  <div className="bg-black w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl font-semibold">
                    # {index + 1}
                  </div>
                  <div>
                    {" "}
                    <p className="text-black">
                      Form: {compiledForm["formStructure"]["title"]}
                    </p>
                    <p className="text-gray-700 text-sm ">
                      Registrazione {compiledForm["info"]["idOnlineForm"]}
                    </p>
                  </div>
                  <div className="ml-4 border rounded-full flex px-4 py-1 bg-gray-50">
                    <p>Numero sezioni:</p>
                    {
                      Object.keys(compiledForm).filter(
                        (sectionName) =>
                          sectionName !== "_id" &&
                          sectionName !== "info" &&
                          sectionName !== "formStructure",
                      ).length
                    }
                  </div>
                  <div className="ml-4 border rounded-full flex px-4 py-1 bg-gray-50">
                    <p>Numero campi:</p>
                    {
                      Object.keys(compiledForm)
                        .filter(
                          (sectionName) =>
                            sectionName !== "_id" &&
                            sectionName !== "info" &&
                            sectionName !== "formStructure",
                        )
                        .flatMap((sectionName) =>
                          Object.keys(compiledForm[sectionName]),
                        ).length
                    }
                  </div>
                  <Link className="ml-auto" to={"/admin/companies"}>
                    <Button>
                      Visualizza tutti i form <ExternalLink />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Tabella ultimi form */}
      <div className="border shadow rounded-xl h-80 mt-8 p-8 overflow-y-auto">
        <h1 className="font-medium text-xl">Ultimi form creati</h1>
        {isLoadingLastForms ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : isErrorLastForms ? (
          <div className="mt-4 bg-red-100 p-4 text-red-600 rounded-xl text-center flex gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è stato possibile recuperare i form. Riprovare più tardi
            </p>
          </div>
        ) : lastForms.length === 0 ? (
          <div className="bg-gray-100 mt-4 flex w-full p-4 text-gray-600 rounded-xl text-center gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è presente nessun form. Crea il tuo primo form subito!
            </p>
          </div>
        ) : (
          <Table className="mt-4 ">
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead>Note Interne</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data creazione</TableHead>
                <TableHead className="text-right">
                  Data ultima modifica
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {lastForms.map((form) => (
                <TableRow key={form._id} className="">
                  <TableCell className="font-medium ">{form.title}</TableCell>
                  <TableCell className="w-64 wrap-break-word whitespace-normal">
                    {form.note ? form.note : "Nessuna nota inserita"}
                  </TableCell>
                  <TableCell className="flex">
                    {form.status === "draft" ? (
                      <div className="border px-4 py-0.5 text-xs rounded-xl text-center border-yellow-600 text-yellow-600 bg-yellow-200/50">
                        In bozza
                      </div>
                    ) : form.status === "offline" ? (
                      <div className="border px-4 py-0.5 text-xs rounded-xl text-center border-red-600 text-red-600 bg-red-200/50">
                        Offline
                      </div>
                    ) : (
                      <div className="border px-4 py-0.5 text-xs rounded-xl text-center border-green-600 text-green-600 bg-green-200/50">
                        Online
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {toStringDate(form.created) +
                      ` ${form.created.getHours().toString().padStart(2, "0")}:${form.created.getMinutes().toString().padStart(2, "0")}:${form.created.getSeconds().toString().padStart(2, "0")}`}
                  </TableCell>
                  <TableCell className="text-right">
                    {toStringDate(form.lastEdit) +
                      ` ${form.lastEdit.getHours().toString().padStart(2, "0")}:${form.lastEdit.getMinutes().toString().padStart(2, "0")}:${form.lastEdit.getSeconds().toString().padStart(2, "0")}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
