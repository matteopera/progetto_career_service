import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import type { contentForm, field, option } from "@/types/formType";
import {
  ChevronLeft,
  ExternalLink,
  Info,
  Loader2,
  Plus,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

export default function FormEditor() {
  // Controllo sessione
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
  // Gestione navigazione
  const navigate = useNavigate();

  const [form, setForm] = useState<contentForm>({
    formTitle: "",
    date: new Date(),
    formNote: "",
    formSubtitle: "",
    sections: [],
  });

  // Stato per eliminazione sezione
  const [sectionToDelete, setSectionToDelete] = useState(-1);
  const [fieldToDelete, setFieldToDelete] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField
  const [optionToDelete, setOptionToDelete] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField-indexOption

  // Gestione draggable per sistemare campi dentro form

  const createSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          sectionTitle: "Nuova sezione",
          sectionNote: "Note nuova sezione",
          fields: [],
        },
      ],
    }));
  };

  // Funzioni di supporto ai campi
  const createField = (
    indexSection: number,
    type: "check" | "radio" | "text",
  ) => {
    const field: field =
      type === "text"
        ? {
            fieldType: "text",
            fieldNote: "Note campo",
            fieldTitle: "Titolo campo",
            textType: "text",
          }
        : {
            fieldType: type,
            fieldNote: "Note campo",
            fieldTitle: "Titolo campo",
            options: [
              { optionName: "Opzione 1", optionNote: "Note opzione 1" },
              { optionName: "Opzione 2", optionNote: "Note opzione 2" },
              { optionName: "Opzione 3", optionNote: "Note opzione 3" },
            ],
          };

    console.log(field);
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, index) =>
        index === indexSection ? { ...s, fields: [...s.fields, field] } : s,
      ),
    }));
  };

  const createOption = (indexSection: number, indexField: number) => {
    const newOption: option = {
      optionName: "Nome nuova opzione",
      optionNote: "Note nuova opzione",
    };
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, index) =>
        index === indexSection
          ? {
              ...s,
              fields: s.fields.map((f, index2) =>
                indexField === index2
                  ? { ...f, options: [...f.options, newOption] }
                  : f,
              ),
            }
          : s,
      ),
    }));
  };

  const updateBaseField = (
    indexSection: number,
    indexField: number,
    attribute: "fieldNote" | "fieldTitle",
    value: string,
  ) => {
    attribute === "fieldTitle"
      ? setForm((prev) => ({
          ...prev,
          sections: prev.sections.map((s, index2) =>
            indexSection === index2
              ? {
                  ...s,
                  fields: s.fields.map((f, index3) =>
                    index3 === indexField
                      ? {
                          ...f,
                          fieldTitle: value,
                        }
                      : f,
                  ),
                }
              : s,
          ),
        }))
      : setForm((prev) => ({
          ...prev,
          sections: prev.sections.map((s, index2) =>
            indexSection === index2
              ? {
                  ...s,
                  fields: s.fields.map((f, index3) =>
                    index3 === indexField
                      ? {
                          ...f,
                          fieldNote: value,
                        }
                      : f,
                  ),
                }
              : s,
          ),
        }));
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex gap-4 items-center">
        <Button
          variant={"outline"}
          onClick={() => {
            navigate("/admin/forms");
          }}
        >
          <ChevronLeft />
        </Button>
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Crea Nuovo Form</h1>
          <p className="text-sm text-gray-500">
            Gestisci i form della piattaforma
          </p>
        </div>
      </div>

      {/* Gestione form */}
      <div className="border shadow rounded-xl mt-8 p-4">
        <div className="flex justify-between">
          <h1 className="font-semibold text-xl">Creazione nuovo form</h1>
          <Button className="px-4 py-2">
            <span>Vai alla preview</span>
            <ExternalLink />
          </Button>
        </div>

        {/* Griglia dove a sinistra metto titolo e altro... */}
        <div className="grid grid-cols-8 mt-4 gap-4">
          <div className="col-span-2">
            <h2 className="font-medium text-lg">Dati Base Form</h2>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">TItolo form</FieldLabel>
              <Input required className=""></Input>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">
                Descrizione form
              </FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">Note form</FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>

            {/*  Informazioni form che non andranno pubblicate */}
            <h2 className="font-medium text-lg mt-4">Dati Interni Form</h2>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">Nome form</FieldLabel>
              <Input required className=""></Input>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">
                Descrizione form
              </FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>
            <Field className="mt-4">
              <FieldLabel htmlFor="field.fieldTitle">Note form</FieldLabel>
              <Textarea required className=""></Textarea>
            </Field>
          </div>
          <div className="col-span-6">
            <h2 className="font-medium text-lg">Campi del form</h2>
            {form.sections.length === 0 ? (
              <div className="flex mt-4 flex-col justify-center gap-4 items-center">
                <div className="flex gap-4 justify-center items-center text-gray-600">
                  <Info className="w-6 h-6" />
                  <span className="text-lg">
                    Crea la tua prima sezione per cominciare
                  </span>
                </div>
                <Button onClick={createSection} className="px-8 h-11!">
                  Crea ora
                </Button>
              </div>
            ) : (
              <>
                {form.sections.map((section, indexSection) => (
                  <div
                    className={`relative ${indexSection % 2 === 0 ? "bg-blue-50/20" : "bg-red-50/20"} border shadow rounded-xl mt-4 p-4 flex items-start justify-between w-full`}
                  >
                    <div className="w-full">
                      <Input
                        value={section.sectionTitle}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s, index2) =>
                              indexSection === index2
                                ? { ...s, sectionTitle: e.target.value }
                                : s,
                            ),
                          }));
                        }}
                        className="text-lg font-semibold bg-trasparent border-0 focus:bg-white w-[95%]"
                      />
                      <Input
                        value={section.sectionNote}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s, index2) =>
                              indexSection === index2
                                ? { ...s, sectionNote: e.target.value }
                                : s,
                            ),
                          }));
                        }}
                        className="text-gray-500 bg-trasparent border-0 focus:bg-white w-[95%]"
                      />
                      {form.sections[indexSection].fields.map(
                        (field, indexField) => (
                          <div
                            className={`relative border ${indexField % 2 === 0 ? "bg-green-50/20" : "bg-yellow-50/20"} shadow mt-4 p-4 rounded-xl w-full`}
                          >
                            <div className="flex items-start">
                              <Input
                                value={field.fieldTitle}
                                onChange={(e) => {
                                  setForm((prev) => ({
                                    ...prev,
                                    sections: prev.sections.map((s, index2) =>
                                      indexSection === index2
                                        ? {
                                            ...s,
                                            fields: s.fields.map((f, index3) =>
                                              index3 === indexField
                                                ? {
                                                    ...f,
                                                    fieldTitle: e.target.value,
                                                  }
                                                : f,
                                            ),
                                          }
                                        : s,
                                    ),
                                  }));
                                }}
                                className="text-lg font-semibold bg-trasparent border-0 focus:bg-white w-[95%]"
                              />
                              <div className="absolute right-5 top-5">
                                {fieldToDelete ===
                                `${indexSection}-${indexField}` ? (
                                  <Button
                                    onClick={() => {
                                      setForm((prev) => ({
                                        ...prev,
                                        sections: prev.sections.map(
                                          (s, index2) =>
                                            indexSection === index2
                                              ? {
                                                  ...s,
                                                  fields: s.fields.filter(
                                                    (f, index3) =>
                                                      index3 !== indexField,
                                                  ),
                                                }
                                              : s,
                                        ),
                                      }));
                                      setFieldToDelete("");
                                    }}
                                    variant={"destructive"}
                                    className="p-2 h-auto!"
                                  >
                                    Confermi eliminazione?
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() =>
                                      setFieldToDelete(
                                        `${indexSection}-${indexField}`,
                                      )
                                    }
                                    variant={"destructive"}
                                    className="p-2 mr h-auto!"
                                  >
                                    <Trash className="w-5! h-5! " />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <Input
                              value={field.fieldNote}
                              onChange={(e) =>
                                updateBaseField(
                                  indexSection,
                                  indexField,
                                  "fieldNote",
                                  e.target.value,
                                )
                              }
                              className="text-gray-500 bg-trasparent border-0 focus:bg-white w-[95%]"
                            />

                            {field.fieldType === "text" ? (
                              <div className="flex flex-col gap-2 mt-4">
                                <Label>Tipologia input di testo</Label>
                                <Select defaultValue="all">
                                  <SelectTrigger className="w-1/4 h-11!">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {/*     textType: "text" | "email" | "tel" | "CF" | "P.IVA"; */}
                                      <SelectItem value="text">
                                        Testo
                                      </SelectItem>
                                      <SelectItem value="email">
                                        Email
                                      </SelectItem>
                                      <SelectItem value="tel">
                                        Telefono
                                      </SelectItem>
                                      <SelectItem value="CF">
                                        Codice Fiscale
                                      </SelectItem>
                                      <SelectItem value="P.IVA">
                                        Partita IVA
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 mt-4">
                                {form.sections[indexSection].fields[
                                  indexField
                                ].options.map(
                                  (option: option, indexOption: number) => (
                                    <div className="flex items-start relative border rounded-xl py-4 px-6">
                                      {form.sections[indexSection].fields[
                                        indexField
                                      ].fieldType === "check" ? (
                                        <Checkbox
                                          checked={true}
                                          className="mr-4 mt-4.5"
                                        />
                                      ) : (
                                        <RadioGroup
                                          className="w-min mt-4.5 mr-4.5"
                                          value={""}
                                        >
                                          <RadioGroupItem
                                            value={""}
                                            id={``}
                                            className="border  border-indigo-300"
                                          />
                                        </RadioGroup>
                                      )}
                                      <div className="">
                                        <Input
                                          value={option.optionName}
                                          onChange={(e) => {
                                            setForm((prev) => ({
                                              ...prev,
                                              sections: prev.sections.map(
                                                (s, index2) =>
                                                  indexSection === index2
                                                    ? {
                                                        ...s,
                                                        fields: s.fields.map(
                                                          (f, index3) =>
                                                            index3 ===
                                                            indexField
                                                              ? {
                                                                  ...f,
                                                                  options:
                                                                    f.options.map(
                                                                      (
                                                                        o,
                                                                        index4,
                                                                      ) =>
                                                                        index4 ===
                                                                        indexOption
                                                                          ? {
                                                                              ...o,
                                                                              optionName:
                                                                                e
                                                                                  .target
                                                                                  .value,
                                                                            }
                                                                          : f,
                                                                    ),
                                                                }
                                                              : f,
                                                        ),
                                                      }
                                                    : s,
                                              ),
                                            }));
                                          }}
                                          className="text-lg font-semibold border-0 ring-0 p-0 focus:ring-0! hover:ring-0! hover:border-0!"
                                        />
                                        <Input
                                          value={option.optionNote}
                                          onChange={(e) => {
                                            setForm((prev) => ({
                                              ...prev,
                                              sections: prev.sections.map(
                                                (s, index2) =>
                                                  indexSection === index2
                                                    ? {
                                                        ...s,
                                                        fields: s.fields.map(
                                                          (f, index3) =>
                                                            index3 ===
                                                            indexField
                                                              ? {
                                                                  ...f,
                                                                  options:
                                                                    f.options.map(
                                                                      (
                                                                        o,
                                                                        index4,
                                                                      ) =>
                                                                        index4 ===
                                                                        indexOption
                                                                          ? {
                                                                              ...o,
                                                                              optionNote:
                                                                                e
                                                                                  .target
                                                                                  .value,
                                                                            }
                                                                          : f,
                                                                    ),
                                                                }
                                                              : f,
                                                        ),
                                                      }
                                                    : s,
                                              ),
                                            }));
                                          }}
                                          className="text-gray-500 text-sm border-0 ring-0 p-0 focus:ring-0! hover:ring-0! hover:border-0!"
                                        />
                                      </div>
                                      <div className="absolute top-5 right-5">
                                        {optionToDelete ===
                                        `${indexSection}-${indexField}-${indexOption}` ? (
                                          <Button
                                            onClick={() => {
                                              setForm((prev) => ({
                                                ...prev,
                                                sections: prev.sections.map(
                                                  (s, index2) =>
                                                    indexSection === index2
                                                      ? {
                                                          ...s,
                                                          fields: s.fields.map(
                                                            (f, index3) =>
                                                              index3 ===
                                                              indexField
                                                                ? {
                                                                    ...f,
                                                                    options:
                                                                      f.options.filter(
                                                                        (
                                                                          _,
                                                                          index4,
                                                                        ) =>
                                                                          index4 !==
                                                                          indexOption,
                                                                      ),
                                                                  }
                                                                : f,
                                                          ),
                                                        }
                                                      : s,
                                                ),
                                              }));
                                              setOptionToDelete(-1);
                                            }}
                                            variant={"destructive"}
                                            className="p-2 h-auto!"
                                          >
                                            Confermi eliminazione?
                                          </Button>
                                        ) : (
                                          <Button
                                            onClick={() =>
                                              setOptionToDelete(
                                                `${indexSection}-${indexField}-${indexOption}`,
                                              )
                                            }
                                            variant={"destructive"}
                                            className="p-2 h-auto!"
                                          >
                                            <Trash className="w-5! h-5! " />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                                <Button
                                  onClick={() =>
                                    createOption(indexSection, indexField)
                                  }
                                >
                                  <Plus />
                                  <p>Aggiungi opzione ora</p>
                                </Button>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button className="px-8 h-11! mt-4">
                            <Plus />
                            <p>Aggiungi nuovo campo</p>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => createField(indexSection, "text")}
                          >
                            Campo Input testo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => createField(indexSection, "radio")}
                          >
                            Campo Input Radio
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => createField(indexSection, "check")}
                          >
                            Campo Input Checkbox
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute right-4 top-4">
                      {sectionToDelete === indexSection ? (
                        <Button
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              sections: prev.sections.filter(
                                (s, index2) => indexSection !== index2,
                              ),
                            }));
                            setSectionToDelete(-1);
                          }}
                          variant={"destructive"}
                          className="p-2 h-auto!"
                        >
                          Confermi eliminazione?
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSectionToDelete(indexSection)}
                          variant={"destructive"}
                          className="p-2 h-auto!"
                        >
                          <Trash className="w-5! h-5! " />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col justify-center gap-4 items-center">
                  <Button onClick={createSection} className="px-8 h-11! mt-4">
                    <Plus />
                    <p>Aggiungi sezione ora</p>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
