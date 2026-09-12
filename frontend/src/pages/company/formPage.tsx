import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Form from "@/components/form";
import { useEffect, useState } from "react";
import useFetchForm  from "@/hooks/useFetchForm";
import { Spinner } from "@/components/ui/spinner";
import type { faqListType } from "@/types/FAQType";
import faqApi from "@/api/faqApi";
export default function formPage() {
  const { form, isLoading, error } = useFetchForm();

  const [faqList, setFaqList] = useState<faqListType | null>(null);

  useEffect(() => {
    faqApi()
      .then((data) => {
        setFaqList(data);
      })
      .catch((error) => {
        console.error(`Errore nel caricamento delle Faq:${error}`);
      });
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-r from-orange-400 via-red-500 to-pink-500">
        <Spinner className="h-7 w-7" />
        <p>Caricamento del form in corso</p>
      </div>
    );
  }
  if (error != null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
        <p>Si è verificato un errore. Si consiglia di riprovare</p>
      </div>
    );
  }
  if (form == null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
        <p>Si è verificato un errore. Si consiglia di riprovare</p>
      </div>
    );
  }
  return (
    <div className=" bg-slate-50">
      <nav className="border-b border-gray-300">
        <img
          src="logo_univr.png"
          alt="Logo Università di Verona"
          className="w-54 mx-auto "
        />
      </nav>
      <div className="flex flex-row w-screen bg-slate-50">
        {/* <div
          id="sidebar"
          className="hidden h-screen md:block w-xs bg-indigo-100  pl-3 pt-3 pr-3"
        >
          <h2 className="font-semibold text-2xl">Registrati all'evento</h2>
          <h3 className="text-sm">Evento di maggio 2025</h3>
          <div className="gap-3 flex flex-col justify-start mt-7">
            {form.sections.map((s) => {
              return (
                <Button
                  key={`${s.sectionTitle}Button`}
                  variant="link"
                  className="text-sm h-12 items-center justify-start pl-4 overflow-hidden"
                >
                  <a href={`#${s.sectionTitle}`}>{s.sectionTitle}</a>
                </Button>
              );
            })}
          </div>
        </div> */}
        <div id="form" className="font-semibold md:ml-32 md:mr-32 ml-7 mr-7 mt-4 w-full">
          <div className="border border-gray-300 rounded-2xl p-5 gap-3 flex flex-col">
          <h1 className="text-4xl">
            Registra la tua azienda
          </h1>
          <h2 className=" font-normal text-xl text-gray-400">
            Compila il modulo per iscriverti al nostro evento di Career Service
            e scoprire le opportunità di collaborazione con i nostri studenti
          </h2>
          </div>
            <Form contentForm={form}></Form>
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
