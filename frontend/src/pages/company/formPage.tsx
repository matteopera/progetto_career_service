import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { contentForm } from "@/types/formType";
import Form from "@/components/form";
import { useEffect, useState } from "react";
import useFetchForm from "@/hooks/useFetchForm";
import { Spinner } from "@/components/ui/spinner";
export default function formPage() {
  const { form, isLoading, error } = useFetchForm();
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
        <Spinner className="h-7 w-7" />
        <p>Caricamento del form in corso</p>
      </div>
    );
  }
  if (error != null) {
    return <></>;
  }
  if (form == null) {
    return <></>;
  }

  return (
    <div className="bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
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
              <h2 className="text-xl sm:text-3xl">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                className="mb-10 w-full sm:max-w-3xl"
                collapsible
              ></Accordion>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
