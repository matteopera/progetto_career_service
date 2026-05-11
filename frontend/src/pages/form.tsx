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
import { type textField, type formType } from "@/type/formType";
import { Check } from "lucide-react";

export default function Form() {
  const [FAQ, setFAQ] = useState<FAQ[] | []>([]);
  const [form, setForm] = useState<formType | null>(null);
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
            <h2 className="text-gray-400">
              Compila il modulo per iscriverti al nostro evento di Career
              Service e scoprire le opportunità di collaborazione con i nostri
              studenti
            </h2>
            <div className="bg-white border rounded-2xl pl-3 pr-3 mt-10 p-4">
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
                {form?.sezioni.map((s) => {
                  return (
                    <>
                      <h3 className="col-span-full">{s.titolo}</h3>
                      {s.nota != "null" ? <p className="col-span-full text-gray-400">{s.nota}</p> : <></>}
                      {s.campi.map((c) => {
                        if (c.tipo == "text") {
                          //gestione del campo come textField
                          return (
                            <div key={`${c.nome}_${s.titolo}`}>
                              <Field>
                                <FieldLabel htmlFor={`${c.nome}_${s.titolo}`}>
                                  {c.nome}
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
                        if (c.tipo == "selezione") {
                          return (
                            <>
                            <h4 className="col-span-full">{c.nome}</h4>
                              <Field orientation="horizontal">
                                {c.selezioni.map((sel) => {
                                  return (
                                    <div>
                                      <Checkbox
                                        key={`${s.nota}_${c.nome}_${c.nome}`}
                                        id={`${s.nota}_${c.nome}_${c.nome}`}
                                        name={`${s.nota}_${c.nome}_${c.nome}`}
                                      />
                                      <FieldLabel className="col-span-full"
                                        htmlFor={`${s.nota}_${c.nome}_${c.nome}`}
                                      >
                                        {sel.nome}
                                      </FieldLabel>
                                      {sel.nota!="null"?(<FieldDescription>
                                          {sel.nota}
                                        </FieldDescription>):<></>}
                                    </div>
                                  );
                                })}
                              </Field>
                            </>
                          );
                        }
                        if (c.tipo == "selezione-multipla") {
                          return (
                            <>
                            <h4 className="col-span-full">{c.nome}</h4>
                              <RadioGroup
                                defaultValue=""
                                className="w-fit sm:col-span-2 "
                              >
                                {c.selezioni.map((sel) => {
                                  return (
                                    <>
                                      <Field orientation="horizontal">
                                        <RadioGroupItem
                                          value={sel.nome}
                                          id={sel.nome}
                                        ></RadioGroupItem>
                                        <FieldContent>
                                          <FieldLabel htmlFor={sel.nome}>
                                            {sel.nome}
                                          </FieldLabel>
                                        </FieldContent>
                                        {sel.nota!="null"?(<FieldDescription>
                                          {sel.nota}
                                        </FieldDescription>):<></>}
                                      </Field>
                                    </>
                                  );
                                })}
                              </RadioGroup>
                            </>
                          );
                        }
                      })}
                    </>
                  );
                })}
                {/* <h3 className="font-normal col-span-full">Dati dell'azienda</h3>
                <Field>
                  <FieldLabel htmlFor="nomeAzienda">Nome azienda</FieldLabel>
                  <Input id="nomeAzienda" placeholder="nome azienda" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="sedeLegale">Sede legale</FieldLabel>
                  <Input id="sedeLegale" placeholder="Italia" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="codiceFiscale">
                    Codice fiscale
                  </FieldLabel>
                  <Input id="codiceFiscale" placeholder="CF" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="partitaIVA">Partita IVA</FieldLabel>
                  <Input id="partitaIVA" placeholder="P.IVA" />
                </Field>
                <h3 className="col-span-full">
                  L'azienda richiede di partecipare:
                </h3>
                <RadioGroup
                  defaultValue="online"
                  className="w-fit sm:col-span-2 "
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem
                      value="online"
                      id="partecipazioneSoloOnline"
                    ></RadioGroupItem>
                    <FieldContent>
                      <FieldLabel htmlFor="partecipazioneSoloOnline">
                        Solo online
                      </FieldLabel>
                    </FieldContent>
                    <FieldDescription>
                      Descrizione("con profilo aziendale sul portale recruiting
                      day verona ")
                    </FieldDescription>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem
                      value="presenza"
                      id="partecipazioneInPresenza"
                    ></RadioGroupItem>
                    <FieldContent>
                      <FieldLabel htmlFor="partecipazioneInPresenza">
                        Online+ Presenza
                      </FieldLabel>
                    </FieldContent>
                    <FieldDescription>
                      Descrizione("con profilo aziendale sul portale recruiting
                      day verona ")
                    </FieldDescription>
                  </Field>
                </RadioGroup>
                <h3 className="col-span-full">Giorno di partecipazione</h3>
                <p className="col-span-full text-gray-400">
                  L'evento si svolge presso il Polo Santa Marta dell'univeristà
                  degli studi di Verona (via Cantarane 24) il 22, il 23 e il 24
                  ottobre 2025. L’azienda può candidarsi* alla partecipazione ad
                  una giornata in presenza esprimendo la propria preferenza per
                  uno o più dei seguenti giorni: (barrare una o più opzioni)
                </p>
                <Field orientation="horizontal">
                  <Checkbox
                    id="giornoPartecipazione22"
                    name="giornoPartecipazione22"
                  />
                  <FieldLabel htmlFor="giornoPartecipazione22">
                    mercoled' 22 ottober (9:30-16:30)
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="giornoPartecipazione23"
                    name="giornoPartecipazione23"
                  />
                  <FieldLabel htmlFor="giornoPartecipazione23">
                    mercoled' 23 ottober (9:30-16:30)
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="giornoPartecipazione24"
                    name="giornoPartecipazione24"
                  />
                  <FieldLabel htmlFor="giornoPartecipazione24">
                    mercoled' 24 ottober (9:30-16:30)
                  </FieldLabel>
                </Field>
                <h3 className="col-span-full mt-4">Nota</h3>
                <p>Qui ci andrebbe la nota chilometrica con tante specifiche</p>
                <h3 className="mt-4 col-span-full">
                  Numero posizioni da coprire
                </h3>
                <Field orientation="horizontal">
                  <Checkbox id="umanistica" name="umanistica" />
                  <FieldLabel htmlFor="umanistica">umanistica</FieldLabel>
                </Field>

                <h3 className="mt-4 col-span-full">posizioni cat protette</h3>
                <Field orientation="horizontal">
                  <Checkbox id="posUmanistica" name="posUmanistica" />
                  <FieldLabel htmlFor="posUmanistica">umanistica</FieldLabel>
                </Field>
                <h3 className="mt-4 col-span-full">
                  Contatti del referente aziendale
                </h3>
                <Field>
                  <FieldLabel htmlFor="nomeReferente">
                    Nome e cognome
                  </FieldLabel>
                  <Input id="nomeReferente"></Input>
                </Field>
                <Field>
                  <FieldLabel htmlFor="ruoloAziendale">
                    Ruolo aziendale
                  </FieldLabel>
                  <Input id="ruoloAziendale" placeholder="CEO"></Input>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">e-mail</FieldLabel>
                  <Input
                    id="email"
                    placeholder="nome.cognome@dominio.it"
                  ></Input>
                </Field>
                <Field>
                  <FieldLabel htmlFor="telDiretto">tel. diretto</FieldLabel>
                  <Input id="telDiretto" placeholder="35476524563"></Input>
                </Field>
                <h3 className="mt-4 col-span-full"> Email aziendale</h3>
                <Field>
                  <FieldLabel htmlFor="emailAziendale">e-mail</FieldLabel>
                  <Input
                    id="emailAziendale"
                    placeholder="azienda@dominio.it"
                  ></Input>
                </Field> */}
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
                <Button>Invia</Button>
              </div>
            </div>
            <section
              id="faq"
              className=" flex flex-col items-center mt-10 w-full"
            >
              <h2 className="text-3xl">Frequently Asked Questions</h2>
              <Accordion
                type="single"
                className="mb-10 w-full sm:max-w-3xl"
                collapsible
              >
                {FAQ.map((question, index) => {
                  return (
                    <AccordionItem value={`accordioni${index}`}>
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
