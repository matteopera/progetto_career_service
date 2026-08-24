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
export default function formPage() {
  const { form, isLoading, error } = useFetchForm();

  const [faqList,setFaqList]=useState<faqListType|null>(null)

  useEffect(()=>{
    faqApi().then((data)=>{
      setFaqList(data)
    }).catch((error)=>{
      console.error(`Errore nel caricamento delle Faq:${error}`)
    })
  },[])
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-r from-orange-400 via-red-500 to-pink-500">
        <Spinner className="h-7 w-7" />
        <p>Caricamento del form in corso</p>
      </div>
    );
  }
  if (error != null) {
    return <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
        <p>Si è verificato un errore. Si consiglia di riprovare</p>
      </div>;
  }
  if (form == null) {
    return <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
        <p>Si è verificato un errore. Si consiglia di riprovare</p>
      </div>;
  }
  return (
    <div className=" bg-linear-to-br from-green-400 to-cyan-500">
      <nav>
        <img
          src="logo_univr.png"
          alt="Logo Università di Verona"
          className="w-54 mx-auto"
        />
      </nav>
      <div className="mt-4">
        <div className=" flex justify-center w-full pl-4 pr-4">
          <div>
            <h1 className="font-normal text-4xl">Registra la tua azienda</h1>
            <h2 className="text-gray-400 text-xl sm:text-2xl">
              Compila il modulo per iscriverti al nostro evento di Career
              Service e scoprire le opportunità di collaborazione con i nostri
              studenti
            </h2>
            <div className="bg-white border rounded-2xl pl-3 pr-3 mt-10 p-4 min-h-96">
              <Form contentForm={form}></Form>
            </div>

            <section
              id="faq"
              className=" flex flex-col items-center mt-10 w-full"
            >
              <h2 className="text-xl sm:text-3xl mb-3">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="pl-3 pr-3 min-h-20 mb-7 max-w-7xl">
                  {faqList!=null? (faqList.map((faq,i)=>{
                    return(
                    <AccordionItem value={`${i}`} className="border-b px-4 last:border-b-0" key={`faq-${i}`}>
                      <AccordionTrigger>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  )
                  })):<></>}
              </Accordion>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
