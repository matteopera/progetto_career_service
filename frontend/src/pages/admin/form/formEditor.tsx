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
import type { contentForm, field, form, option } from "@/types/formType";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Edit,
  Grip,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { ReactSortable } from "react-sortablejs";
import { toast } from "sonner";

export default function FormEditor({
  form,
  setForm,
  goToStep,
}: {
  form: Omit<form, "_id" | "lastEdit" | "created">;
  setForm: Dispatch<SetStateAction<Omit<form, "_id" | "lastEdit" | "created">>>;
  goToStep: (index: number) => void;
}) {
  // Stato per eliminazione sezione
  const [sectionToDelete, setSectionToDelete] = useState(-1);
  const [fieldToDelete, setFieldToDelete] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField
  const [optionToDelete, setOptionToDelete] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField-indexOption

  const [sectionToEdit, setSectionToEdit] = useState(-1);
  const [fieldToEdit, setFieldToEdit] = useState(""); // Uso la stringa per così faccio associazione indexSection-indexField

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem("formInCostruzione", JSON.stringify(form));
    }, 10000);

    return () => clearTimeout(saveTimeout);
  }, [form]);
  // Ogni dieci secondi salvo

  // Gestione sezioni (Creazioni, spostamento, modifica, elimina)
  const createSection = () => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: [
          ...prev.content.sections,
          {
            sectionTitle: `Nuova sezione ${prev.content.sections.length + 1}`,
            sectionNote: "Note nuova sezione",
            fields: [],
          },
        ],
      },
    }));
  };

  const deleteSection = () => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.filter(
          (s, index2) => sectionToDelete !== index2,
        ),
      },
    }));
    setFieldToEdit("");
    setSectionToEdit(-1);

    setSectionToDelete(-1);
  };

  const updateSection = (
    indexSection: number,
    attribute: "sectionTitle" | "sectionNote",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s, index2) =>
          indexSection === index2 ? { ...s, [attribute]: value } : s,
        ),
      },
    }));
  };

  // Gestione posizione sezione
  const moveUpSection = (e: any, indexSection: number) => {
    e.preventDefault();
    setSectionToEdit(-1);
    if (indexSection === 0 || form.content.sections.length == 1) {
      return;
    }

    const sections = [...form.content.sections];
    // Swap sessioni
    const tempSection = sections[indexSection];
    sections[indexSection] = sections[indexSection - 1];
    sections[indexSection - 1] = tempSection;

    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, sections: sections },
    }));
  };

  const moveDownSection = (e: any, indexSection: number) => {
    e.preventDefault();

    if (
      indexSection === form.content.sections.length - 1 ||
      form.content.sections.length == 1
    ) {
      return;
    }

    const sections = [...form.content.sections];
    // Swap sessioni
    const tempSection = sections[indexSection];
    sections[indexSection] = sections[indexSection + 1];
    sections[indexSection + 1] = tempSection;

    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, sections: sections },
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

    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s, index) =>
          index === indexSection ? { ...s, fields: [...s.fields, field] } : s,
        ),
      },
    }));
  };

  const updateField = (
    indexSection: number,
    indexField: number,
    attribute: "fieldTitle" | "fieldNote" | "textType",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s, index2) =>
          indexSection === index2
            ? {
                ...s,
                fields: s.fields.map((f, index3) =>
                  indexField === index3 ? { ...f, [attribute]: value } : f,
                ),
              }
            : s,
        ),
      },
    }));
  };

  const deleteField = () => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s, index2) =>
          Number(fieldToDelete.split("-")[0]) === index2
            ? {
                ...s,
                fields: s.fields.filter(
                  (f, index3) => index3 !== Number(fieldToDelete.split("-")[1]),
                ),
              }
            : s,
        ),
      },
    }));

    setFieldToDelete("");
  };

  // Gestione opzioni
  const createOption = (indexSection: number, indexField: number) => {
    const newOption: option = {
      optionName: "Nome nuova opzione",
      optionNote: "Note nuova opzione",
    };
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s, index) =>
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
      },
    }));
  };

  const updateOption = (
    indexSection: number,
    indexField: number,
    indexOption: number,
    attribute: "optionName" | "optionNote",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s, index2) =>
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
      },
    }));
  };

  const deleteOption = () => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map((s, index2) =>
          Number(optionToDelete.split("-")[0]) === index2
            ? {
                ...s,
                fields: s.fields.map((f, index3) =>
                  index3 === Number(optionToDelete.split("-")[1]) &&
                  (f.fieldType === "check" || f.fieldType === "radio")
                    ? {
                        ...f,
                        options: f.options.filter(
                          (_, index4) =>
                            index4 !== Number(optionToDelete.split("-")[2]),
                        ),
                      }
                    : f,
                ),
              }
            : s,
        ),
      },
    }));

    setOptionToDelete("");
  };

  const nextStep = () => {
    // Controllo che ci sia almeno una sezione e un field
    if (
      form.content.sections.length == 0 ||
      form.content.sections.some((s) => s.fields.length == 0)
    ) {
      toast.error(
        "Creare almeno una sezione e un campo. Ogni sezione deve avere almeno un campo",
      );
      return;
    }
    if (form.content.sections.some((s) => s.sectionTitle === "")) {
      toast.error("Le sezioni devono avere un titolo obbligatorio");
      return;
    }
    if (
      form.content.sections
        .flatMap((s) => s.fields)
        .some((f) => f.fieldTitle === "")
    ) {
      toast.error("I campi devono avere un titolo obbligatorio");
      return;
    }
    if (
      form.content.sections
        .flatMap((s) => s.fields)
        .filter((f) => f.fieldType === "check" || f.fieldType === "radio")
        .flatMap((f) => f.options)
        .some((o) => o.optionName === "")
    ) {
      toast.error(
        "Le opzioni dei campi radio o checkbox devono avere un titolo obbligatorio",
      );
      return;
    }
    goToStep(2);
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
          <Button onClick={nextStep} className="px-4 h-10!">
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
                {form.content.sections.length}{" "}
                {form.content.sections.length === 1 ? "Sezione" : "Sezioni"}-
                {form.content.sections.flatMap((s) => s.fields).length}{" "}
                {form.content.sections.length === 1 ? "Campo" : "Campi"}
              </p>
            </div>
            {form.content.sections.length === 0 ? (
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
                  {form.content.sections.map((section, indexSection) => (
                    <AccordionItem
                      value={`item-${indexSection}`}
                      className="border-b-red-50/0"
                    >
                      <div className="relative">
                        <AccordionTrigger
                          className={`border ${sectionToEdit === indexSection ? "border-black" : "border-gray-200"} bg-gray-100/50 rounded-b-none px-5`}
                        >
                          <div className="flex flex-col gap-2">
                            <p
                              className={`${section.sectionTitle === "" && "text-gray-500"} text-xl`}
                            >
                              {section.sectionTitle === ""
                                ? "Nessun titolo fornito"
                                : section.sectionTitle}
                            </p>
                            <p
                              className={`${section.sectionNote === "" ? "text-gray-400" : "text-gray-600"} font-light`}
                            >
                              {section.sectionNote === ""
                                ? "Nessun titolo fornito"
                                : section.sectionNote}
                            </p>
                          </div>
                        </AccordionTrigger>
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
                              setFieldToEdit("");
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
                      </div>
                      <AccordionContent>
                        <div
                          className={`flex-col cursor-pointer relative border p-2 flex items-start rounded-b-xl justify-between w-full ${sectionToEdit === indexSection ? "border-black " : "border-gray-200"}`}
                        >
                          <ReactSortable<any>
                            list={form.content.sections[indexSection].fields}
                            setList={(reorderedFields) => {
                              setFieldToDelete("");
                              setSectionToEdit(-1);
                              setFieldToEdit(``);

                              setForm((prev) => ({
                                ...prev,
                                content: {
                                  ...prev.content,
                                  sections: prev.content.sections.map(
                                    (s, idx) =>
                                      idx === indexSection
                                        ? { ...s, fields: reorderedFields }
                                        : s,
                                  ),
                                },
                              }));
                            }}
                            handle=".handle"
                            className="w-full"
                          >
                            {form.content.sections[indexSection].fields.map(
                              (field, indexField) => (
                                <div
                                  className={`relative border bg-white shadow mt-4 p-4 rounded-xl w-full group `}
                                  onClick={() => {
                                    setFieldToDelete("");
                                    setSectionToEdit(-1);
                                    setFieldToEdit(
                                      `${indexSection}-${indexField}`,
                                    );
                                  }}
                                >
                                  <div className="flex items-start ">
                                    <Grip className="handle w-5 h-5 mt-4 text-gray-500" />

                                    <div className="flex flex-col gap-2 border-l pl-2 ml-2">
                                      <p
                                        className={`${field.fieldTitle === "" && "text-gray-400"} text-xl group-hover:underline`}
                                      >
                                        {field.fieldTitle === ""
                                          ? "Nessun titolo fornito"
                                          : field.fieldTitle}
                                      </p>
                                      <p
                                        className={`${field.fieldNote === "" ? "text-gray-400" : "text-gray-600"}  font-light group-hover:underline`}
                                      >
                                        {field.fieldNote === ""
                                          ? "Nessun titolo fornito"
                                          : field.fieldNote}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-auto">
                                      <div
                                        className={`${Number(fieldToEdit.split("-")[0]) === indexSection && Number(fieldToEdit.split("-")[1]) === indexField ? "bg-black text-white" : "bg-gray-50 text-black"} rounded-full text-sm px-3 py-0.5`}
                                      >
                                        {Number(fieldToEdit.split("-")[0]) ===
                                          indexSection &&
                                        Number(fieldToEdit.split("-")[1]) ===
                                          indexField
                                          ? "Modifica in corso"
                                          : field.fieldType === "text"
                                            ? "Tipologia: Testo"
                                            : field.fieldType == "radio"
                                              ? "Tipologia: Radio"
                                              : "Tipologia: Checkbox"}
                                      </div>
                                      <div>
                                        {fieldToDelete ===
                                        `${indexSection}-${indexField}` ? (
                                          <Button
                                            onClick={(e: any) => {
                                              e.stopPropagation();
                                              deleteField();
                                            }}
                                            variant={"destructive"}
                                            className="p-2 h-auto!"
                                          >
                                            Confermi eliminazione?
                                          </Button>
                                        ) : (
                                          <Button
                                            onClick={(e: any) => {
                                              e.stopPropagation();

                                              setFieldToEdit("");
                                              setFieldToDelete(
                                                `${indexSection}-${indexField}`,
                                              );
                                            }}
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
                          </ReactSortable>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="w-full">
                              <div className="flex mt-4 py-4 rounded-xl cursor-pointer border-dashed transition-color duration-150 hover:bg-green-100/20 text-green-700 justify-center gap-4 items-center border border-green-700">
                                <Plus />
                                <span className="">
                                  Aggiungi un nuovo campo
                                </span>
                              </div>
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
              Proprietà {sectionToEdit !== -1 ? "Sezione" : "Campo"}
            </h2>
            {sectionToEdit !== -1 ? (
              <>
                <Field className="mt-8">
                  <FieldLabel htmlFor="field.fieldTitle">
                    Titolo sezione
                  </FieldLabel>
                  <Input
                    value={form.content.sections[sectionToEdit].sectionTitle}
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
                    value={form.content.sections[sectionToEdit].sectionNote}
                    placeholder="Note della sezione..."
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
                <Field className="mt-8">
                  <FieldLabel htmlFor="field.fieldTitle">
                    Titolo campo
                  </FieldLabel>
                  <Input
                    value={
                      form.content.sections[Number(fieldToEdit.split("-")[0])]
                        .fields[Number(fieldToEdit.split("-")[1])].fieldTitle
                    }
                    placeholder="Titolo della sezione..."
                    onChange={(e) => {
                      updateField(
                        Number(fieldToEdit.split("-")[0]),
                        Number(fieldToEdit.split("-")[1]),
                        "fieldTitle",
                        e.target.value,
                      );
                    }}
                  />
                </Field>
                <Field className="mt-4">
                  <FieldLabel htmlFor="field.fieldTitle">Note campo</FieldLabel>
                  <Input
                    value={
                      form.content.sections[Number(fieldToEdit.split("-")[0])]
                        .fields[Number(fieldToEdit.split("-")[1])].fieldNote
                    }
                    placeholder="Note della sezione..."
                    onChange={(e) =>
                      updateField(
                        Number(fieldToEdit.split("-")[0]),
                        Number(fieldToEdit.split("-")[1]),
                        "fieldNote",
                        e.target.value,
                      )
                    }
                  />
                </Field>

                {form.content.sections[Number(fieldToEdit.split("-")[0])]
                  .fields[Number(fieldToEdit.split("-")[1])].fieldType ===
                "text" ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <Label>Tipologia input di testo</Label>
                    <Select
                      defaultValue="text"
                      value={
                        form.content.sections[Number(fieldToEdit.split("-")[0])]
                          .fields[Number(fieldToEdit.split("-")[1])].textType
                      }
                      onValueChange={(newType) =>
                        updateField(
                          Number(fieldToEdit.split("-")[0]),
                          Number(fieldToEdit.split("-")[1]),
                          "textType",
                          newType,
                        )
                      }
                    >
                      <SelectTrigger className="w-full h-11!">
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
                ) : form.content.sections[Number(fieldToEdit.split("-")[0])]
                    .fields[Number(fieldToEdit.split("-")[1])].fieldType ===
                    "radio" ||
                  form.content.sections[Number(fieldToEdit.split("-")[0])]
                    .fields[Number(fieldToEdit.split("-")[1])].fieldType ===
                    "check" ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <ReactSortable<any>
                      className="flex flex-col gap-4"
                      list={
                        form.content.sections[Number(fieldToEdit.split("-")[0])]
                          .fields[Number(fieldToEdit.split("-")[1])].options
                      }
                      setList={(reorderedOptions) => {
                        setForm((prev) => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            sections: prev.content.sections.map((s, index) =>
                              index === Number(fieldToEdit.split("-")[0])
                                ? {
                                    ...s,
                                    fields: s.fields.map((f, index2) =>
                                      Number(fieldToEdit.split("-")[1]) ===
                                        index2 &&
                                      (f.fieldType === "check" ||
                                        f.fieldType === "radio")
                                        ? {
                                            ...f,
                                            options: reorderedOptions,
                                          }
                                        : f,
                                    ),
                                  }
                                : s,
                            ),
                          },
                        }));
                      }}
                      handle=".handle-option"
                    >
                      {form.content.sections[
                        Number(fieldToEdit.split("-")[0])
                      ].fields[Number(fieldToEdit.split("-")[1])].options?.map(
                        (option: option, indexOption: number) => (
                          <div className=" items-start relative border rounded-xl py-4 px-6">
                            <>
                              <Grip className="w-5 h-5 handle-option cursor-pointer" />
                              {form.content.sections[
                                Number(fieldToEdit.split("-")[0])
                              ].fields[Number(fieldToEdit.split("-")[1])]
                                .fieldType === "check" ? (
                                <Checkbox
                                  checked={true}
                                  className="mr-4 mt-4.5"
                                />
                              ) : (
                                <RadioGroup
                                  className="w-min mt-4 mr-4.5 flex items-center font-semibold"
                                  value={""}
                                >
                                  <RadioGroupItem
                                    value={""}
                                    id={``}
                                    className="border  border-indigo-300"
                                  />
                                  Radio
                                </RadioGroup>
                              )}
                            </>
                            <div className="">
                              <Field className="mt-4">
                                <FieldLabel htmlFor="field.fieldTitle">
                                  Nome opzione
                                </FieldLabel>
                                <Input
                                  value={option.optionName}
                                  placeholder="Titolo della opzione..."
                                  onChange={(e) => {
                                    updateOption(
                                      Number(fieldToEdit.split("-")[0]),
                                      Number(fieldToEdit.split("-")[1]),
                                      indexOption,
                                      "optionName",
                                      e.target.value,
                                    );
                                  }}
                                />
                              </Field>

                              <Field className="mt-4">
                                <FieldLabel htmlFor="field.fieldTitle">
                                  Note opzione
                                </FieldLabel>
                                <Input
                                  value={option.optionNote}
                                  placeholder="Note della opzione..."
                                  onChange={(e) => {
                                    updateOption(
                                      Number(fieldToEdit.split("-")[0]),
                                      Number(fieldToEdit.split("-")[1]),
                                      indexOption,
                                      "optionNote",
                                      e.target.value,
                                    );
                                  }}
                                />
                              </Field>
                            </div>
                            <div className="absolute top-5 right-5">
                              {optionToDelete ===
                              `${Number(fieldToEdit.split("-")[0])}-${Number(fieldToEdit.split("-")[1])}-${indexOption}` ? (
                                <Button
                                  onClick={() => {
                                    deleteOption();
                                  }}
                                  variant={"destructive"}
                                  className="p-2 h-auto!"
                                >
                                  <Check className="w-5! h-5! " />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    setOptionToDelete(
                                      `${Number(fieldToEdit.split("-")[0])}-${Number(fieldToEdit.split("-")[1])}-${indexOption}`,
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
                    </ReactSortable>
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
                ) : (
                  <></>
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
