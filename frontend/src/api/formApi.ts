// import { formTypeZod } from "@/type/formType";
// import * as z from "zod";
// export default async function getForm() {
//   try {
//     const url = "http://localhost:3000/api/aziende/form";
//     const res = await fetch(url);

//     if (!res.ok) {
//       console.error("Errore HTTP:", res.status);
//       return null;
//     }

//     const resJson = await res.json();

//     const form = formTypeZod.safeParse(resJson);
//     if (!form.success) {
//       //errore nel parsing
//       console.error(form.error);

//       return null;
//     }

//     //ritorno del form tipato
//     return form.data;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }
