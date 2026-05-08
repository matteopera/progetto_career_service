import {db} from "../db/db.js"

export async function findFaq(){
    try{
        console.log("Arrivo al DAO");
        const faqCollection=db.collection("FAQ");
        const res= await faqCollection.find().toArray(); //query di tutte le FAQ
        const mappedRes=res.map(r=>({
            ...r,
            _id: r._id.toString()
        }))
        return mappedRes;
    }catch(error){
        console.error(error); //stampa dell'errore
    }
}