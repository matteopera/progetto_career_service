import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { contentForm } from "@/types/formType";
import {
  Delete,
  Download,
  DownloadIcon,
  File,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import getPDF, { saveCompiledPDF } from "@/api/pdfApi";
export default function pdfPage() {
  const navigate = useNavigate();
  const maxSizeInMB = 2;
  const [files, setFiles] = useState<File[] | null>();
  const [fileError, setFileError] = useState<string | null>(null);
  const [fetchingFileError, setFetchingFileError] = useState<Error | null>(
    null,
  );
  const [savingFileError, setSavingFileError] = useState<Error | null>(null);
  const location = useLocation();
  const { id, value, form } = location.state || {};
  async function downloadPdf(id: string) {
    try {
      const res = await getPDF(id);
    } catch (e) {
      setFetchingFileError(new Error("Errore nel download del file"));
    }
  }

  async function savePDF(file: File) {
    try {
      setSavingFileError(null);
      const res = await saveCompiledPDF(file, id);
      setSavingFileError(null);
      //rimozione pagina errore 
      localStorage.removeItem("id_compiled_form")
      localStorage.removeItem("value_compiled_form")
      //navigazione pagina finale
      navigate("/company/iscrizione-effettuata", { replace: true });
    } catch (error) {
      setSavingFileError(new Error("Errore nel salvataggio del file"));
    }
  }
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    noKeyboard: true,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 1024 * 1024 * maxSizeInMB,
    noDragEventsBubbling: true,
    onDrop: (a: File[]) => {
      setFileError(null);
      setFiles(a);
    },
    onDropRejected: (fileRejections) => {
      const { file, errors } = fileRejections[0];
      const error = errors[0];
      switch (error.code) {
        case "file-too-large":
          setFileError(`${file.name} è troppo grande `);
          return `${file.name} è troppo `;
        case "too-many-files":
          setFileError(`Troppi file`);
          return `Troppi file`;
        default:
          setFileError("Errore nel caricamento del file");
          return error.message;
      }
    },
  });

  return (
    <div>
      <nav className="border-b border-gray-300">
        <img
          src="/logo_univr.png"
          alt="Logo Università di Verona"
          className="w-54 mx-auto "
        />
      </nav>
      <div className="ml-7 mr-7 md:ml-32 md:mr-32 ">
        <div className="md:flex md:flex-row items-center justify-between p-5 border border-gray-300 rounded-2xl mt-3 mb-16">
          <div className="mb-2 md:mb-0">
            <h1 className=" text-2xl md:text-4xl font-bold">
              Iscrizione espositori- completa
            </h1>
            <p className="text-gray-400">
              Scarica, firma e invia il PDF per iscriverti ufficialemente all'evento
            </p>
          </div>
          <span className="bg-orange-100 text-orange-700 p-1 pl-3 pr-3 rounded-2xl">
            Da inoltrare
          </span>
        </div>

        {(form as contentForm).sections.map((s, index) => {
          return (
            <div className="mb-5" key={s.sectionTitle}>
              <div className="bg-gray-100 p-3 pl-5 rounded-tl-2xl rounded-tr-2xl">
                <p className="font-bold">{`Sezione ${index + 1} · ${s.sectionTitle}`}</p>
              </div>
              <div className="columns-1 lg:columns-2 gap-4 p-3 pl-5 border-r-2 border-l-2 border-b-2 rounded-bl-2xl rounded-br-2xl border-gray-100">
                {s.fields.map((f) => {
                  return (
                    <div
                      className="flex-col lg: flex lg:flex-row justify-between mb-3 break-inside-avoid"
                      key={`${s.sectionTitle}-${f.fieldTitle}`}
                    >
                      <p className="text-gray-500 mr-2">{`${f.fieldTitle}`}</p>
                      <p className="font-bold">
                        {`${value[s.sectionTitle][f.fieldTitle]}`.replaceAll(
                          ",",
                          ", ",
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="border-2 border-gray-100 p-5 rounded-2xl mb-3">
          <div className="border-2  border-gray-100 rounded-2xl">
            <div className=" flex flex-col items-center justify-center gap-3  md:flex md:flex-row md:items-center md:justify-between p-3">
              <div className="flex items-center gap-4 justify-start w-full">
                <File className="bg-blue-100 w-10 h-10 p-2.5 rounded-lg text-blue-500 shrink-0"></File>
                <div className="flex flex-col">
                  <p className="font-semibold">Modulo da stampare e firmare</p>
                  <p className="text-gray-400">PDF non compilato</p>
                </div>
              </div>
              <Button onClick={() => downloadPdf(id)} className="bg-blue-500">
                <DownloadIcon /> Scarica PDF
              </Button>
            </div>
            {fetchingFileError === null ? null : (
              <div className="pl-5 pb-3">
                <p className="text-red-400">
                  Impossibile scaricare il file desiderato
                </p>
              </div>
            )}
          </div>
          <p className="font-semibold mt-5"> Documento firmato</p>
          <p className="text-gray-400">
            {" "}
            Stampa il PDF sopra, firmalo e ricaricalo qui.
          </p>
          <div className="container mb-3 ">
            <div
              {...getRootProps({
                className:
                  "dropzone border-gray-200 bg-gray-100 border rounded-2xl flex flex-col items-center justify-center p-7 gap-4 mt-4",
              })}
            >
              <input {...getInputProps()} />
              <Upload className="rounded-xl h-12 w-12 bg-blue-100 text-blue-500 p-2.5" />
              <p className="font-semibold">
                Trascina qui il PDF firmato o clicca per sfogliare i file
              </p>
              <p className="text-gray-400">
                PDF · max {maxSizeInMB} MB · Un solo file caricabile
              </p>
              <p className="text-red-400">
                {fileError !== null ? fileError : null}
              </p>
            </div>
          </div>
          {files?.map((f) => {
            return (
              <div
                className="border-2  border-gray-100 rounded-2xl mb-5"
                key={f.name}
              >
                <div className=" flex flex-col items-center justify-center gap-3  md:flex md:flex-row md:items-center md:justify-between  p-3 ">
                  <div className="flex flex-row items-center gap-4 justify-start w-full">
                    <File className="bg-gray-100 w-10 h-10 p-2.5 rounded-lg text-black shrink-0" />
                    <div className="flex flex-col  ">
                      <p className="font-semibold">{f.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-3 mt-2 md:mt-0">
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        setFiles(null);
                        setSavingFileError(null);
                      }}
                    >
                      <X />
                      Cancella
                    </Button>
                    <Button onClick={() => savePDF(f)} className="bg-blue-500 ">
                      Invia
                    </Button>
                  </div>
                </div>
                {savingFileError === null ? null : (
                  <p className="text-red-400 ml-3 mr-3 mb-3">
                    Errore nel salvaggio del file si prega di riprovare
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
