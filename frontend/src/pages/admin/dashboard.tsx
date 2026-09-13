import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { error } from "better-auth/api";
import {
  Calendar,
  CircleAlert,
  Database,
  EllipsisVertical,
  FormIcon,
  Loader2,
  Users,
  type IconNode,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";

export default function Dashboard() {
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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [forms, setForms] = useState<form[]>([]);

  const [cardDatas, setCardData] = useState<
    {
      id: number;
      name: string;
      value: string;
      icon: LucideIcon;
    }[]
  >([]);

  useEffect(() => {
    getCardData();
    getForms();
  }, []);

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
    } finally {
    }
  };

  const getForms = async () => {
    try {
      const response = await axios.get("/api/form/get-last");
      const forms = response.data.forms;
      // Le date sono stringhe devo trasformarle in Date
      setForms(
        forms.map((form: any) => ({
          ...form,
          created: new Date(form.created),
          lastEdit: new Date(form.lastEdit),
        })),
      );
      setForms(
        forms.map((form: any) => ({
          ...form,
          created: new Date(form.created),
          lastEdit: new Date(form.lastEdit),
        })),
      );
      setIsError(false);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toStringDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };
  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-3xl">Dashboard</h1>
      <p className="text-sm text-gray-500">
        Una visualizzazione generale della piattaforma
      </p>

      {/* cardData */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
        {cardDatas.map((data) => (
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
      </div>

      {/* Tabella ultime aziende */}
      <div className="border shadow rounded-xl h-80 mt-8 p-4">
        <h1 className="font-medium text-xl">Ultime aziende registrate</h1>
      </div>
      {/* Tabella ultimi form */}
      <div className="border shadow rounded-xl h-80 mt-8 p-8">
        <h1 className="font-medium text-xl">Ultimi form creati</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : isError ? (
          <div className="mt-4 bg-red-100 p-4 text-red-600 rounded-xl text-center flex gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è stato possibile recuperare i form. Riprovare più tardi
            </p>
          </div>
        ) : forms.length === 0 ? (
          <div className="bg-gray-100 mt-4 flex w-full p-4 text-gray-600 rounded-xl text-center gap-4 justify-center">
            <CircleAlert />
            <p className=" rounded-xl text-center">
              Non è presente nessun form. Crea il tuo primo form subito!
            </p>
          </div>
        ) : (
          <div className="mx-4">
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
                {forms.map((form) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
