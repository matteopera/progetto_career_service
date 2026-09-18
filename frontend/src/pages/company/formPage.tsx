import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Form from "@/components/form";
import { useEffect, useState } from "react";
import useFetchForm, { valueZod, type value } from "@/hooks/useFetchForm";
import { Spinner } from "@/components/ui/spinner";
import type { faqListType } from "@/types/faqType";
import faqApi from "@/api/faqApi";
import { useParams } from "react-router";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
export default function formPage() {
  const { formId } = useParams();
  const { form, isLoading, error } = useFetchForm(
    formId === undefined ? null : formId,
  );
  const [pendingSubmissionId, setPendingSubmissionId] = useState<string | null>(
    null,
  );
  const [pendingSubmissionValue, setPendingSubmissionValue] =
    useState<value | null>(null);
  const [faqList, setFaqList] = useState<faqListType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    faqApi()
      .then((data) => {
        setFaqList(data);
      })
      .catch((error) => {
        console.error(`Errore nel caricamento delle Faq:${error}`);
        setFaqList(null)
      });
    try {
      const id = localStorage.getItem("id_compiled_form");
      const pendingValue = localStorage.getItem("value_compiled_form");
      if (id && pendingValue) {
        const value = JSON.parse(pendingValue);
        //parsing con zod del value
        const parsedValue = valueZod.safeParse(value);

        if (parsedValue.success) {
          setPendingSubmissionValue(JSON.parse(pendingValue));
          setPendingSubmissionId(id);
        } else {
          setPendingSubmissionId(null);
          setPendingSubmissionValue(null);
        }
      }
    } catch (error) {
      setPendingSubmissionId(null);
          setPendingSubmissionValue(null);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Spinner className="h-7 w-7" />
        <p>Caricamento del form in corso</p>
      </div>
    );
  }
  if (error != null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <p>Si è verificato un errore. Si consiglia di riprovare</p>
      </div>
    );
  }
  if (form == null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <p>Si è verificato un errore. Si consiglia di riprovare</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen  overflow-x-hidden">
      <nav className="border-b border-gray-300">
        <img
          src="/logo_univr.png"
          alt="Logo Università di Verona"
          className="w-54 mx-auto "
        />
      </nav>
      <div className="flex flex-row w-full ">
        <div
          id="form"
          className="font-semibold md:ml-32 md:mr-32 ml-7 mr-7 mt-4 w-full"
        >
          {formId === undefined ? null : (
            <div className="border border-yellow-500 rounded-2xl p-5 gap-3 flex flex-col mb-7">
              <div className="flex flex-row items-center gap-5">
                <TriangleAlert className="h-10 w-10 text-yellow-500" />
                <h1 className="text-4xl text-yellow-500">Attenzione</h1>
              </div>
              <p className=" font-normal text-xl ">
                Pagina di sola anteprima del modulo per le aziende: l'invio dei
                dati è disabilitato{" "}
              </p>
            </div>
          )}
          <div className="border border-gray-300 rounded-2xl p-5 gap-3 flex flex-col mb-7">
            <h1 className="text-4xl">Registra la tua azienda</h1>
            <h2 className=" font-normal text-xl text-gray-400">
              Compila il modulo per iscriverti al nostro evento di Career
              Service e scoprire le opportunità di collaborazione con i nostri
              studenti
            </h2>
          </div>
          {pendingSubmissionId === null ? null : (
            <div className="  p-3 rounded-2xl gap-3 flex flex-row justify-between items-center mb-2 border-yellow-500 border ">
              <p className=" font-normal text-lg">
                Hai una registrazione in sospeso: il modulo è già stato inviato,
                manca solo la firma del documento
              </p>
              <div className="flex felx-row gap-4">
                <Button
                  className="bg-blue-500"
                  onClick={() => {
                    navigate("/company/pdf", {
                      replace: true,
                      state: {
                        id: pendingSubmissionId,
                        value: pendingSubmissionValue,
                        form: form,
                      },
                    });
                  }}
                >
                  Riprendi registrazione
                </Button>
                <Button
                  variant={"secondary"}
                  className="bg-gray-300"
                  onClick={() => setPendingSubmissionId(null)}
                >
                  Inizia da capo
                </Button>
              </div>
            </div>
          )}
          <Form
            contentForm={form}
            formId={formId === undefined ? null : formId}
          ></Form>
          <h2 className=" font-normal text-xl bg-gray-100 rounded-tl-2xl rounded-tr-2xl p-3 pl-5">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className=" pl-3 pr-3 min-h-20 mb-7 border-2 rounded-bl-2xl rounded-br-2xl border-gray-100 pt-4 "
          >
            {faqList != null ? (
              faqList.map((faq, i) => {
                return (
                  <AccordionItem
                    value={`${i}`}
                    className="border-b px-4 last:border-b-0"
                    key={`faq-${i}`}
                  >
                    <AccordionTrigger className="font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-normal mb-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })
            ) : (
              <></>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
