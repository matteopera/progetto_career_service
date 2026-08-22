import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { CircleAlert, EllipsisVertical, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { form } from "@/types/formType";
import { authClient } from "@/lib/auth-client";
import { Navigate, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Forms() {
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

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [forms, setForms] = useState<form[]>([]);
  useEffect(() => {
    getForms();
  }, []);

  const getForms = async () => {
    try {
      const response = await axios.get("/api/form/get");
      // Le date sono stringhe devo trasformarle in Date
      console.log("test->");
      setForms(
        response.data.map((form: any) => ({
          ...form,
          created: new Date(form.created),
          lastEdit: new Date(form.lastEdit),
        })),
      );
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toStringDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };
  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="font-bold text-3xl">Form</h1>
      <p className="text-sm text-gray-500">Gestisci i form della piattaforma</p>

      {/* Input di ricerca + aggiungi form */}
      <div className="flex gap-4 my-4 ">
        <Input
          className="w-2/4 h-11!"
          placeholder="Ricerca form per nome o per contenuto note..."
        />
        <Select defaultValue="all">
          <SelectTrigger className="w-1/4 h-11!">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="draft">In bozza</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            navigate("/admin/form");
          }}
          className="w-1/4 h-11!"
        >
          <Plus />
          <span className="">Crea nuovo form</span>
        </Button>
      </div>

      {/* Tabella ultime aziende */}
      <div className="border shadow rounded-xl h-full mt-8 p-4">
        <h1 className="font-semibold text-xl">I miei forms</h1>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : error ? (
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
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form._id} className="">
                    <TableCell className="font-medium ">{form.title}</TableCell>
                    <TableCell className="w-64 wrap-break-word whitespace-normal">
                      {form.note}
                    </TableCell>
                    <TableCell className="flex">
                      {form.status === "draft" ? (
                        <div className="border px-4 py-1 rounded-xl text-center border-yellow-600 text-yellow-600 bg-yellow-200/50">
                          In bozza
                        </div>
                      ) : form.status === "offline" ? (
                        <div>Offline</div>
                      ) : (
                        <div>Online</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {toStringDate(form.created)}
                    </TableCell>
                    <TableCell className="text-right">
                      {toStringDate(form.lastEdit) +
                        ` ${form.lastEdit.getHours()}:${form.lastEdit.getMinutes()}:${form.lastEdit.getSeconds()}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuGroup>
                            <DropdownMenuItem>Copia link</DropdownMenuItem>
                            <DropdownMenuItem>Mostra preview</DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem>Modifica form</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              Elimina form
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
