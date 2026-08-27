import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { contentForm } from "@/types/formType";
import Form from "@/components/form";
import { useEffect, useState } from "react";
import useFetchForm, { useValue } from "@/hooks/useFetchForm";
import { Spinner } from "@/components/ui/spinner";
import type { faqListType } from "@/types/FAQType";
import faqApi from "@/api/faqApi";
import { Ghost, Sidebar } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <div
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
        </div>
        <div id="form" className="w-full font-semibold">
          <h1 className="text-4xl mb-3 mt-4 ml-3 mr-3 md:ml-7 md:mr-7 ">
            Registra la tua azienda
          </h1>
          <h2 className=" font-normal text-xl mb-4 ml-3 mr-3 md:ml-7 md:mr-7">
            Compila il modulo per iscriverti al nostro evento di Career Service
            e scoprire le opportunità di collaborazione con i nostri studenti
          </h2>
          <hr className="border-gray-300" />
            <Form contentForm={form}></Form>
          <hr className="border-gray-300 mb-4" />
          <h2 className=" font-normal text-xl mb-4 ml-3 mr-3 md:ml-7 md:mr-7">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="pl-7 pr-7 min-h-20 mb-7 "
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
