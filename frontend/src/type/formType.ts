// import * as z from "zod"


// export const textFieldZod=z.object({
//     nome:z.string(),
//     tipo:z.literal("text"),
//     placeolder:z.string()   
// })




// export const selection=z.object({ //viene condiviso dalla selezione e la selezione multipla
//     nome:z.string(),
//     nota:z.string()
// })




// export const selectionField=z.object({
//     nome:z.string(),
//     nota:z.string(),
//     tipo:z.literal("selezione"),
//     selezioni:z.array(selection)   
// })



// export const multipleSelectionField=z.object({
//     nome:z.string(),
//     nota:z.string(),
//     tipo:z.literal("selezione-multipla"),
//     selezioni:z.array(selection) 
// })



// export const section=z.object({
//     titolo:z.string(),
//     nota:z.string(),
//     campi:z.array(z.union([textFieldZod,selectionField,multipleSelectionField]))

// })


// export const formTypeZod=z.object({
//     _id:z.string(),
//     nome:z.string(),
//     sezioni:z.array(section)
// })



// export type formType=z.infer<typeof formTypeZod>
// export type textField=z.infer<typeof textFieldZod>


export type form={ //form
    "formTitle":string,
    "formSubtitle":string,
    "formNote":string,
    "sections":section[],
    "date":string //sostituibile dalla generazione automatica nel pdf
}

export type section={
    "sectionTitle":string,
    "sectionNote":string,
    "fields":field[],
}

export type textField={
    "fieldTitle":string,
    "fieldType":"text",
    "fieldNote":string,
    "textType":textType,
}



export type checkboxField={
    "fieldTitle":string,
    "fieldType":"check",
    "fieldNote":string,
    "options":option[]
}

export type radioField={
    "fieldTitle":string,
    "fieldType":"radio",
    "fieldNote":string,
    "options":option[]
}

export type option={
    "optionName":string,
    "optionNote":string
}

export type field=textField | checkboxField | radioField

export type textType="text"|"email"|"tel"|"CF"|"P.IVA"

