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
import type { contentForm, field, form, option } from "@/types/formType";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  ExternalLink,
  Info,
  Loader2,
  Plus,
  Trash,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Navigate } from "react-router";

export default function FormEditor({
  sectionsForm,
  setSectionForm,
  goToStep,
}: {
  sectionsForm: Pick<contentForm, "sections">;
  setSectionForm: Dispatch<SetStateAction<Pick<contentForm, "sections">>>;
  goToStep: (index: number) => void;
}) {
  // Stato per eliminazione sezione
  const [sectionToDelete, setSectionToDelete] = useState(-1);
  const [fieldToDelete, setFieldToDelete] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField
  const [optionToDelete, setOptionToDelete] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField-indexOption

  // Gestione draggable per sistemare campi dentro form

  const createSection = () => {
    setSectionForm((prev) => ({
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

  const createSectionMiddle = (indexSectionPrev: number) => {
    const newSection = {
      sectionTitle: "Nuova sezione",
      sectionNote: "Note nuova sezione",
      fields: [],
    };

    const sections = [...sectionsForm.sections];
    sections.splice(indexSectionPrev + 1, 0, newSection);
    setSectionForm((prev) => ({
      ...prev,
      sections: sections,
    }));
  };

  const moveUpSection = (indexSection: number) => {
    if (indexSection === 0 || sectionsForm.sections.length == 1) {
      return;
    }

    const sections = [...sectionsForm.sections];
    // Swap sessioni
    const tempSection = sections[indexSection];
    sections[indexSection] = sections[indexSection - 1];
    sections[indexSection - 1] = tempSection;

    setSectionForm((prev) => ({ ...prev, sections: sections }));
  };

  const moveDownSection = (indexSection: number) => {
    if (
      indexSection === sectionsForm.sections.length - 1 ||
      sectionsForm.sections.length == 1
    ) {
      return;
    }

    const sections = [...sectionsForm.sections];
    // Swap sessioni
    const tempSection = sections[indexSection];
    sections[indexSection] = sections[indexSection + 1];
    sections[indexSection + 1] = tempSection;

    setSectionForm((prev) => ({ ...prev, sections: sections }));
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
    setSectionForm((prev) => ({
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
    setSectionForm((prev) => ({
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
      ? setSectionForm((prev) => ({
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
      : setSectionForm((prev) => ({
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
      {/* Gestione form */}
      <div className="border shadow rounded-xl mt-8 p-4">
        <div className="flex justify-between mb-4">
          <Button onClick={() => goToStep(0)} className="px-4 h-10!">
            <ChevronLeft />
            <span>Vai allo step precedente</span>
          </Button>
          <h1 className="font-semibold text-2xl">Creazione nuovo form</h1>
          <Button onClick={() => goToStep(2)} className="px-4 h-10!">
            <span>Vai al prossimo step</span>
            <ChevronRight />
          </Button>
        </div>

        {/* Griglia dove a sinistra metto titolo e altro... */}
        <div className="grid grid-cols-8 mt-4 gap-4">
          <div className="col-span-6">
            <h2 className="font-medium text-lg">Campi del form</h2>
            {sectionsForm.sections.length === 0 ? (
              <div
                onClick={createSection}
                className="flex mt-4 py-4 rounded-xl cursor-pointer hover:bg-blue-100/20 text-blue-700 justify-center gap-4 items-center border border-blue-700"
              >
                <Plus />
                <span className="">Inizia creando la tua prima sezione</span>
              </div>
            ) : (
              <>
                {sectionsForm.sections.map((section, indexSection) => (
                  <>
                    <div
                      className={`relative bg-blue-100/20 border shadow rounded-xl mt-4 p-4 flex items-start justify-between w-full`}
                    >
                      <div className="absolute gap-4 flex right-10 -top-4  ">
                        <div
                          className="rounded-xl bg-white border w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                          onClick={() => moveUpSection(indexSection)}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </div>
                        <div
                          onClick={() => moveDownSection(indexSection)}
                          className="rounded-xl bg-white border w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                        <div className="rounded-xl bg-gray-500/10 border w-8 h-8 flex items-center justify-center">
                          <Copy className="w-4 h-4 text-gray-500/50" />
                        </div>
                        {sectionToDelete === indexSection ? (
                          <Button
                            onClick={() => {
                              setSectionForm((prev) => ({
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
                            className=" w-8 h-8"
                          >
                            <Trash className="w-4! h-4!" />
                          </Button>
                        )}
                      </div>
                      <div className="w-full">
                        <Input
                          value={section.sectionTitle}
                          placeholder="Titolo della sezione..."
                          onChange={(e) => {
                            setSectionForm((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, index2) =>
                                indexSection === index2
                                  ? { ...s, sectionTitle: e.target.value }
                                  : s,
                              ),
                            }));
                          }}
                          className="h-9! text-lg font-semibold bg-trasparent border-0! ring-0! w-[95%]"
                        />
                        <Input
                          value={section.sectionNote}
                          onChange={(e) => {
                            setSectionForm((prev) => ({
                              ...prev,
                              sections: prev.sections.map((s, index2) =>
                                indexSection === index2
                                  ? { ...s, sectionNote: e.target.value }
                                  : s,
                              ),
                            }));
                          }}
                          className="text-gray-500 h-9! text-sm bg-trasparent border-0! ring-0! w-[95%]"
                        />
                        {sectionsForm.sections[indexSection].fields.map(
                          (field, indexField) => (
                            <div
                              className={`relative border bg-white shadow mt-4 p-4 rounded-xl w-full`}
                            >
                              <div className="flex items-start">
                                <Input
                                  value={field.fieldTitle}
                                  onChange={(e) => {
                                    setSectionForm((prev) => ({
                                      ...prev,
                                      sections: prev.sections.map(
                                        (s, index2) =>
                                          indexSection === index2
                                            ? {
                                                ...s,
                                                fields: s.fields.map(
                                                  (f, index3) =>
                                                    index3 === indexField
                                                      ? {
                                                          ...f,
                                                          fieldTitle:
                                                            e.target.value,
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
                                        setSectionForm((prev) => ({
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
                                  {sectionsForm.sections[indexSection].fields[
                                    indexField
                                  ].options.map(
                                    (option: option, indexOption: number) => (
                                      <div className="flex items-start relative border rounded-xl py-4 px-6">
                                        {sectionsForm.sections[indexSection]
                                          .fields[indexField].fieldType ===
                                        "check" ? (
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
                                              setSectionForm((prev) => ({
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
                                                                            : o,
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
                                              setSectionForm((prev) => ({
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
                                                setSectionForm((prev) => ({
                                                  ...prev,
                                                  sections: prev.sections.map(
                                                    (s, index2) =>
                                                      indexSection === index2
                                                        ? {
                                                            ...s,
                                                            fields:
                                                              s.fields.map(
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
                    </div>
                    {indexSection !== sectionsForm.sections.length - 1 && (
                      <div className="relative w-full flex justify-center h-10">
                        <div
                          onClick={() => createSectionMiddle(indexSection)}
                          className="absolute w-8 h-8 flex justify-center items-center top-3 rounded-xl bg-white border z-10"
                        >
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </>
                ))}
                <div
                  onClick={createSection}
                  className="flex mt-4 py-4 rounded-xl cursor-pointer hover:bg-blue-100/20 text-blue-700 justify-center gap-4 items-center border border-blue-700"
                >
                  <Plus />
                  <span className="">Aggiungi una nuova sezione</span>
                </div>
              </>
            )}
          </div>

          <div className="col-span-2">
            <h2 className="font-medium text-lg">Campi del form</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
