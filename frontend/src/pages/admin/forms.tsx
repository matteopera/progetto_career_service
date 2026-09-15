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
import { Link, Navigate, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [forms, setForms] = useState<form[]>([]);
  const [deleteFormDialogOpen, setDeleteFormDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  useEffect(() => {
    if (session.user) getForms();
  }, [session]);
  const [filteredForms, setFilteredForms] = useState<form[]>([]);

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
      setFilteredForms(
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

  const deleteForm = async () => {
    setIsDeleting(true);
    try {
      await axios.post("/api/form/delete-form", {
        idForm: selectedFormId,
      });

      toast.success("Form eliminato con successo");
      setSelectedFormId("");
      setDeleteFormDialogOpen(false);
      getForms();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            error.response.data?.message || "Errore durante la eliminazione",
          );
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const toStringDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  useEffect(() => {
    setFilteredForms(
      forms.filter((form) => {
        return searchStatus === "all"
          ? form.title.toLowerCase().includes(searchInput.toLowerCase()) ||
              form.note.toLowerCase().includes(searchInput.toLowerCase())
          : (form.title.toLowerCase().includes(searchInput.toLowerCase()) ||
              form.note.toLowerCase().includes(searchInput.toLowerCase())) &&
              form.status === searchStatus;
      }),
    );
  }, [searchInput, searchStatus]);

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    toast.success("Link copiato con successo!");
  };
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <h1 className="font-bold text-3xl">Form</h1>
        <p className="text-sm text-gray-500">
          Gestisci i form della piattaforma
        </p>

        {/* Input di ricerca + aggiungi form */}
        <div className="flex gap-4 my-4 ">
          <Input
            className="w-2/4 h-11! text-sm"
            placeholder="Ricerca form per nome o per contenuto note..."
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <Select
            defaultValue="all"
            onValueChange={(value) => {
              setSearchStatus(value);
            }}
          >
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
        <div className="border shadow rounded-xl h-full mt-4 p-4">
          <h1 className="font-semibold text-xl">I miei forms</h1>
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
          ) : filteredForms.length === 0 ? (
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
                  {filteredForms.map((form) => (
                    <TableRow key={form._id} className="">
                      <TableCell className="font-medium ">
                        {form.title}
                      </TableCell>
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() =>
                                  copyLink("https://" + location.host)
                                }
                              >
                                Copia link
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <Link to={`/admin/form/${form._id}`}>
                                <DropdownMenuItem>
                                  Modifica form
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedFormId(form._id);
                                  setDeleteFormDialogOpen(true);
                                }}
                                variant="destructive"
                              >
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
      <Dialog
        onOpenChange={setDeleteFormDialogOpen}
        open={deleteFormDialogOpen}
      >
        <DialogContent onInteractOutside={() => null}>
          <DialogHeader>
            <DialogTitle>Richiesta conferma eliminazione</DialogTitle>
          </DialogHeader>
          <p>
            Sei sicuro di volere eliminare questo form? Questa operazione è
            irreversibile
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFormId("");
                setDeleteFormDialogOpen(false);
              }}
            >
              Annulla
            </Button>
            <Button type="submit" onClick={deleteForm} disabled={isDeleting}>
              {isDeleting ? "Eliminazione in corso..." : "Elimina form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
