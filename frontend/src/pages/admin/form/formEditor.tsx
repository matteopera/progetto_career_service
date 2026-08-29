import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import type { contentForm, field, option } from "@/types/formType";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Edit,
  Plus,
  Trash,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

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

  const [sectionToEdit, setSectionToEdit] = useState(-1);
  const [fieldToEdit, setFieldToEdit] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField

  // Gestione sezioni (Creazioni, spostamento, modifica, elimina)
  const createSection = () => {
    setSectionForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          sectionTitle: `Nuova sezione ${prev.sections.length + 1}`,
          sectionNote: "Note nuova sezione",
          fields: [],
        },
      ],
    }));
  };

  const deleteSection = () => {
    setSectionForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((s, index2) => sectionToDelete !== index2),
    }));
    setSectionToDelete(-1);
  };

  const moveUpSection = (e: any, indexSection: number) => {
    e.preventDefault();
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

  const moveDownSection = (e: any, indexSection: number) => {
    e.preventDefault();

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

  const updateSection = (
    indexSection: number,
    attribute: "sectionTitle" | "sectionNote",
    value: string,
  ) => {
    setSectionForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, index2) =>
        indexSection === index2 ? { ...s, [attribute]: value } : s,
      ),
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
                indexField === index2 &&
                (f.fieldType === "check" || f.fieldType === "radio")
                  ? { ...f, options: [...f.options, newOption] }
                  : f,
              ),
            }
          : s,
      ),
    }));
  };

  const updateField = (
    indexSection: number,
    indexField: number,
    attribute: "fieldTitle" | "fieldNote",
    value: string,
  ) => {
    setSectionForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, index2) =>
        indexSection === index2
          ? {
              ...s,
              fields: s.fields.map((f, index3) =>
                indexField === index3 ? { ...f, [attribute]: value } : f,
              ),
            }
          : s,
      ),
    }));
  };

  const deleteField = () => {
    setSectionForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, index2) =>
        Number(fieldToDelete.split("-")[0]) === index2
          ? {
              ...s,
              fields: s.fields.filter(
                (f, index3) => index3 !== Number(fieldToDelete.split("-")[1]),
              ),
            }
          : s,
      ),
    }));
    setFieldToDelete("");
  };

  // Gestione opzioni
  const updateOption = (
    indexSection: number,
    indexField: number,
    indexOption: number,
    attribute: "optionName" | "optionNote",
    value: string,
  ) => {
    setSectionForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, index2) =>
        indexSection === index2
          ? {
              ...s,
              fields: s.fields.map((f, index3) =>
                indexField === index3 &&
                (f.fieldType === "radio" || f.fieldType === "check")
                  ? {
                      ...f,
                      options: f.options.map((o, index4) =>
                        index4 === indexOption
                          ? { ...o, [attribute]: value }
                          : o,
                      ),
                    }
                  : f,
              ),
            }
          : s,
      ),
    }));
  };

  const deleteOption = () => {
    setSectionForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, index2) =>
        Number(fieldToDelete.split("-")[0]) === index2
          ? {
              ...s,
              fields: s.fields.map((f, index3) =>
                index3 === Number(fieldToDelete.split("-")[1]) &&
                (f.fieldType === "check" || f.fieldType === "radio")
                  ? {
                      ...f,
                      options: f.options.filter(
                        (_, index4) =>
                          index4 !== Number(fieldToDelete.split("-")[2]),
                      ),
                    }
                  : f,
              ),
            }
          : s,
      ),
    }));
    setOptionToDelete("");
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
        <div className="grid grid-cols-8 mt-4 gap-8">
          <div className="col-span-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-medium text-lg ">Campi del form</h2>
              <p className="text-sm bg-gray-50 rounded-full px-2 py-1">
                {sectionsForm.sections.length}{" "}
                {sectionsForm.sections.length === 1 ? "Sezione" : "Sezioni"}-
                {sectionsForm.sections.flatMap((s) => s.fields).length}{" "}
                {sectionsForm.sections.length === 1 ? "Campo" : "Campi"}
              </p>
            </div>
            {sectionsForm.sections.length === 0 ? (
              <div
                onClick={createSection}
                className="flex mt-4 py-4 rounded-xl cursor-pointer border-dashed transition-color duration-150 hover:bg-blue-100/20 text-blue-700 justify-center gap-4 items-center border border-blue-700"
              >
                <Plus />
                <span className="">Inizia creando la tua prima sezione</span>
              </div>
            ) : (
              <>
                <Accordion
                  type="multiple"
                  className="gap-6"
                  defaultValue={["item-0"]}
                >
                  {sectionsForm.sections.map((section, indexSection) => (
                    <AccordionItem
                      key={section.sectionNote}
                      value={`item-${indexSection}`}
                      className="border-b-red-50/0"
                    >
                      <AccordionTrigger
                        className={`border ${sectionToEdit === indexSection ? "border-black" : "border-gray-200"} bg-gray-100/50 rounded-b-none px-5`}
                      >
                        <div className="absolute gap-4 flex right-10 -top-4 z-20 ">
                          <div
                            className="rounded-xl bg-white border w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => moveUpSection(e, indexSection)}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </div>
                          <div
                            onClick={(e) => moveDownSection(e, indexSection)}
                            className="rounded-xl bg-white border w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              setSectionToEdit(indexSection);
                            }}
                            className="rounded-xl bg-white border w-8 h-8 flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4 " />
                          </div>
                          {sectionToDelete === indexSection ? (
                            <Button
                              onClick={deleteSection}
                              variant={"destructive"}
                              className="p-2 h-auto!"
                            >
                              Confermi eliminazione?
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                setSectionToDelete(indexSection);
                              }}
                              variant={"destructive"}
                              className=" w-8 h-8"
                            >
                              <Trash className="w-4! h-4!" />
                            </Button>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-xl">{section.sectionTitle}</p>
                          <p className="text-gray-600 font-light">
                            {section.sectionNote}
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className={`relative border p-2 flex items-start rounded-b-xl justify-between w-full ${sectionToEdit === indexSection ? "border-black" : "border-gray-200"}`}
                        >
                          <div className="w-full">
                            {sectionsForm.sections[indexSection].fields.map(
                              (field, indexField) => (
                                <div
                                  className={`relative border bg-white shadow mt-4 p-4 rounded-xl w-full`}
                                  onClick={(e) => {
                                    setSectionToEdit(-1);
                                    setFieldToEdit(
                                      `${indexSection}-${indexField}`,
                                    );
                                  }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-2">
                                      <p className="text-xl">
                                        {field.fieldTitle}
                                      </p>
                                      <p className="text-gray-600 font-light">
                                        {field.fieldNote}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div
                                        className={`${Number(fieldToEdit.split("-")[0]) === indexSection && Number(fieldToEdit.split("-")[1]) === indexField ? "bg-black text-white" : "bg-gray-50 text-black"} rounded-full text-sm px-3 py-0.5`}
                                      >
                                        {Number(fieldToEdit.split("-")[0]) ===
                                          indexSection &&
                                        Number(fieldToEdit.split("-")[1]) ===
                                          indexField
                                          ? "Modifica in corso"
                                          : field.fieldType}
                                      </div>
                                      <div>
                                        {fieldToDelete ===
                                        `${indexSection}-${indexField}` ? (
                                          <Button
                                            onClick={deleteField}
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
                                  </div>
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
                                  onClick={() =>
                                    createField(indexSection, "text")
                                  }
                                >
                                  Campo Input testo
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    createField(indexSection, "radio")
                                  }
                                >
                                  Campo Input Radio
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    createField(indexSection, "check")
                                  }
                                >
                                  Campo Input Checkbox
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div
                  onClick={createSection}
                  className="flex mt-4 py-4 rounded-xl cursor-pointer border-dashed transition-color duration-150 hover:bg-blue-100/20 text-blue-700 justify-center gap-4 items-center border border-blue-700"
                >
                  <Plus />
                  <span className="">Aggiungi una nuova sezione</span>
                </div>
              </>
            )}
          </div>

          <div className="col-span-2">
            <h2 className="font-medium text-lg">
              {sectionToEdit !== -1 ? "Proprietà Sezione" : "Proprietà campo"}
            </h2>
            {sectionToEdit !== -1 ? (
              <>
                <Field className="mt-8">
                  <FieldLabel htmlFor="field.fieldTitle">
                    Titolo sezione
                  </FieldLabel>
                  <Input
                    value={sectionsForm.sections[sectionToEdit].sectionTitle}
                    placeholder="Titolo della sezione..."
                    onChange={(e) => {
                      updateSection(
                        sectionToEdit,
                        "sectionTitle",
                        e.target.value,
                      );
                    }}
                  />
                </Field>
                <Field className="mt-4">
                  <FieldLabel htmlFor="field.fieldTitle">
                    Note sezione
                  </FieldLabel>
                  <Input
                    value={sectionsForm.sections[sectionToEdit].sectionNote}
                    onChange={(e) => {
                      updateSection(
                        sectionToEdit,
                        "sectionNote",
                        e.target.value,
                      );
                    }}
                  />
                </Field>
              </>
            ) : fieldToEdit !== "" ? (
              <>
                <Input
                  value={
                    sectionsForm.sections[Number(fieldToEdit.split("-")[0])]
                      .fields[Number(fieldToEdit.split("-")[1])].fieldTitle
                  }
                  onChange={(e) => {
                    updateField(
                      Number(fieldToEdit.split("-")[0]),
                      Number(fieldToEdit.split("-")[1]),
                      "fieldTitle",
                      e.target.value,
                    );
                  }}
                  className="text-lg font-semibold bg-trasparent border-0 focus:bg-white w-[95%]"
                />{" "}
                <Input
                  value={
                    sectionsForm.sections[Number(fieldToEdit.split("-")[0])]
                      .fields[Number(fieldToEdit.split("-")[1])].fieldNote
                  }
                  onChange={(e) =>
                    updateField(
                      Number(fieldToEdit.split("-")[0]),
                      Number(fieldToEdit.split("-")[1]),
                      "fieldNote",
                      e.target.value,
                    )
                  }
                  className="text-gray-500 bg-trasparent border-0 focus:bg-white w-[95%]"
                />
                {sectionsForm.sections[Number(fieldToEdit.split("-")[0])]
                  .fields[Number(fieldToEdit.split("-")[1])].fieldType ===
                "text" ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <Label>Tipologia input di testo</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-1/4 h-11!">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {/*     textType: "text" | "email" | "tel" | "CF" | "P.IVA"; */}
                          <SelectItem value="text">Testo</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Telefono</SelectItem>
                          <SelectItem value="CF">Codice Fiscale</SelectItem>
                          <SelectItem value="P.IVA">Partita IVA</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    {/* {sectionsForm.sections[Number(fieldToEdit.split("-")[0])]
                      .fields[Number(fieldToEdit.split("-")[1])].options?.map(
                      (option: option, indexOption: number) => (
                        <div className="flex items-start relative border rounded-xl py-4 px-6">
                          {field.fieldType === "check" ? (
                            <Checkbox checked={true} className="mr-4 mt-4.5" />
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
                                updateOption(
                                  indexSection,
                                  indexField,
                                  indexOption,
                                  "optionName",
                                  e.target.value,
                                );
                              }}
                              className="text-lg font-semibold border-0 ring-0 p-0 focus:ring-0! hover:ring-0! hover:border-0!"
                            />
                            <Input
                              value={option.optionNote}
                              onChange={(e) => {
                                updateOption(
                                  indexSection,
                                  indexField,
                                  indexOption,
                                  "optionNote",
                                  e.target.value,
                                );
                              }}
                              className="text-gray-500 text-sm border-0 ring-0 p-0 focus:ring-0! hover:ring-0! hover:border-0!"
                            />
                          </div>
                          <div className="absolute top-5 right-5">
                            {optionToDelete ===
                            `${indexSection}-${indexField}-${indexOption}` ? (
                              <Button
                                onClick={deleteOption}
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
                    )} */}
                    <Button
                      onClick={() =>
                        createOption(
                          Number(fieldToEdit.split("-")[0]),
                          Number(fieldToEdit.split("-")[1]),
                        )
                      }
                    >
                      <Plus />
                      <p>Aggiungi opzione ora</p>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div>Seleziona un campo per cominciare</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
