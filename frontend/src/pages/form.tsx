import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import type { FAQ } from "@/type/FAQType";
import { getFAQ } from "@/api/FAQ";
import getForm from "@/api/formApi";
import { type textField, type formType,} from "@/type/formType";
import { Check } from "lucide-react";

export default function Form() {
  const [FAQ, setFAQ] = useState<FAQ[] | []>([]);
  const [form, setForm] = useState<formType | null>(null);

  const handleSubmit=()=>{
    return null;
  }


  useEffect(() => {
    getFAQ().then((res) => {
      setFAQ(res);
    });
  }, []);

  useEffect(() => {
    getForm().then((res) => {
      console.log(res);
      setForm(res);
    });
  }, []);
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
            <div className="bg-white border rounded-2xl pl-3 pr-3 mt-10 p-4">
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  {form?.sezioni.map((s) => {
                    return (
                      <div
                        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                        key={`${s.titolo}`}
                      >
                        <h3 className="col-span-full">{s.titolo}</h3>
                        {s.nota != "null" ? (
                          <p className="col-span-full text-gray-400">
                            {s.nota}
                          </p>
                        ) : (
                          <></>
                        )}
                        {s.campi.map((c) => {
                          if (c.tipo == "text") {
                            //gestione del campo come textField
                            return (
                              <div key={`${c.nome}_${s.titolo}`}>
                                <Field>
                                  <FieldLabel htmlFor={`${c.nome}_${s.titolo}`}>
                                    {`${c.nome}:`}
                                  </FieldLabel>
                                  <Input
                                    id={`${c.nome}_${s.titolo}`}
                                    placeholder={
                                      c.placeolder != null ? c.placeolder : ""
                                    }
                                  ></Input>
                                </Field>
                              </div>
                            );
                          }
                          if (c.tipo == "selezione-multipla") {
                            return (
                              <div key={`${s.nota}_${c.nome}`}>
                                <h4 className="col-span-full mb-2">{`${c.nome}:`}</h4>
                                {c.nota != "null" ? (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="max-w-lg"
                                  >
                                    <AccordionItem value={`${c.nome}`}>
                                      <AccordionTrigger className="text-gray-400">
                                        Più dettagli
                                      </AccordionTrigger>
                                      <AccordionContent>{`${c.nota}`}</AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ) : (
                                  <></>
                                )}
                                {c.selezioni.map((sel) => {
                                  return (
                                    <Field
                                      orientation="horizontal"
                                      key={`${s.titolo}_${c.nome}_${sel.nome}`}
                                    >
                                      <Checkbox
                                        id={`${s.titolo}_${c.nome}`}
                                        name={`${s.titolo}_${c.nome}`}
                                      />
                                      <FieldLabel
                                        htmlFor={`${s.titolo}_${c.nome}`}
                                      >
                                        {sel.nome}
                                      </FieldLabel>
                                      {sel.nota != "null" ? (
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="max-w-lg"
                                        >
                                          <AccordionItem value={`${sel.nome}`}>
                                            <AccordionTrigger className="text-gray-400">
                                              Più dettagli
                                            </AccordionTrigger>
                                            <AccordionContent>{`${sel.nota}`}</AccordionContent>
                                          </AccordionItem>
                                        </Accordion>
                                      ) : (
                                        <></>
                                      )}
                                    </Field>
                                  );
                                })}
                              </div>
                            );
                          }
                          if (c.tipo == "selezione") {
                            return (
                              <div key={`${s.titolo}_${c.nome}`}>
                                <h4 className="col-span-full mb-2">{`${c.nome}:`}</h4>
                                {c.nota != "null" ? (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="max-w-lg"
                                  >
                                    <AccordionItem value={`${c.nome}`}>
                                      <AccordionTrigger className="text-gray-400">
                                        Più dettagli
                                      </AccordionTrigger>
                                      <AccordionContent>{`${c.nota}`}</AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ) : (
                                  <></>
                                )}
                                <RadioGroup
                                  defaultValue=""
                                  className="w-fit sm:col-span-2 "
                                >
                                  {c.selezioni.map((sel) => {
                                    return (
                                      <div
                                        key={`${s.nota}_${c.nome}_${sel.nome}`}
                                      >
                                        <Field orientation="horizontal">
                                          <RadioGroupItem
                                            value={sel.nome}
                                            id={sel.nome}
                                          ></RadioGroupItem>
                                          <FieldContent>
                                            <FieldLabel htmlFor={sel.nome}>
                                              {sel.nome}
                                            </FieldLabel>
                                            {sel.nota != "null" ? (
                                              <Accordion
                                                type="single"
                                                collapsible
                                                className="max-w-lg"
                                              >
                                                <AccordionItem
                                                  value={`${sel.nome}`}
                                                >
                                                  <AccordionTrigger className="text-gray-400">
                                                    Più dettagli
                                                  </AccordionTrigger>
                                                  <AccordionContent>{`${sel.nota}`}</AccordionContent>
                                                </AccordionItem>
                                              </Accordion>
                                            ) : (
                                              <></>
                                            )}
                                          </FieldContent>
                                        </Field>
                                      </div>
                                    );
                                  })}
                                </RadioGroup>
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  })}
                </FieldGroup>

                <p className="mt-4">
                  Vi preghiamo di prendere visione dell'informativa{" "}
                  <a
                    href="https://www.recruitingverona.it/sites/default/files/privacy/privacy-policy-Recruiting-202204.pdf"
                    className="underline"
                  >
                    privacy
                  </a>{" "}
                  e della{" "}
                  <a
                    href="https://www.recruitingverona.it/sites/default/files/privacy/cookie-policy-Recruiting.pdf"
                    className="underline"
                  >
                    coockie policy
                  </a>
                </p>
                <div className="col-span-full mt-4 flex justify-end">
                  <Button type="submit">Invia</Button>
                </div>
              </form>
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
              >
                {FAQ.map((question, index) => {
                  return (
                    <AccordionItem value={`accordioni${index}`} key={index}>
                      <AccordionTrigger>{question.domanda}</AccordionTrigger>
                      <AccordionContent className="pb-4">
                        {question.risposta}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
