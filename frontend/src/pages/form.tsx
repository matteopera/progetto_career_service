import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
export default function Form() {
  return (
    <>
      <nav>
        <img
          src="logo_univr.png"
          alt="Logo Università di Verona"
          className="w-54 mx-auto"
        />
      </nav>
      <div className="mt-4">
        <div className="bg-white flex justify-center w-full pl-4 pr-4">
          <div>
            <h1 className="font-normal text-4xl">Registra la tua azienda</h1>
            <h2 className="text-gray-400">
              Compila il modulo per iscriverti al nostro evento di Career
              Service e scoprire le opportunità di collaborazione con i nostri
              studenti
            </h2>
            <div className="border rounded-2xl pl-3 pr-3 mt-10 p-4">
              <h3 className="font-normal">Titolo sezione</h3>
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
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
                <RadioGroup defaultValue="online" className="w-fit sm: col-span-2 ">
                    <Field orientation="horizontal">
                        <RadioGroupItem value="online" id="partecipazioneSoloOnline"></RadioGroupItem>
                        <FieldContent>
                            <FieldLabel htmlFor="partecipazioneSoloOnline"> Solo online</FieldLabel>
                        </FieldContent>
                        <FieldDescription>Descrizione("con profilo aziendale sul portale recruiting day verona ")</FieldDescription>
                    </Field>
                    <Field orientation="horizontal">
                        <RadioGroupItem value="presenza" id="partecipazioneInPresenza"></RadioGroupItem>
                        <FieldContent>
                            <FieldLabel htmlFor="partecipazioneInPresenza">Online+ Presenza</FieldLabel>
                        </FieldContent>
                        <FieldDescription>Descrizione("con profilo aziendale sul portale recruiting day verona ")</FieldDescription>
                    </Field>
                </RadioGroup>
              </FieldGroup>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
