type form={ //form
    "formTitle":String,
    "formSubtitle":String,
    "formNote":String,
    "sections":section[],
    "date":String //sostituibile dalla generazione automatica nel pdf
}

type section={
    "sectionTitle":String,
    "sectionNote":String,
    "fields":field[],
}

type textField={
    "fieldTitle":String,
    "fieldType":"text",
    "fieldNote":String,
    "textType":textType,
}



type checkboxField={
    "fieldTitle":String,
    "fieldType":"check",
    "fieldNote":String,
    "options":option[]
}

type radioField={
    "fieldTitle":String,
    "fieldType":"radio",
    "fieldNote":String,
    "options":option[]
}

type option={
    "optionName":String,
    "optionNote":String
}

type field=textField | checkboxField | radioField

type textType="text"|"email"|"tel"|"CF"|"P.IVA"

