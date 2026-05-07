import { FiLock, FiMail } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createAuthClient } from "better-auth/react";

export default function Login() {
    // Gestione del form
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);

        // Ottengo dati del form di login
        const data = {
            email: formData.get("email")?.toString() || "",
            password: formData.get("password")?.toString() || "",
            rememberMe: formData.get("rememberMe") === null ? false : true
        }

        try {
            const authClient = createAuthClient()

            const response = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
                callbackURL: "http://localhost:5173/dashboard"
            })
            console.log(response)


            if (!response.data && response.error !== null) {
                console.error("Errore durante richiesta di login", response.error);
                // Errore proveniente da better auth
                if (response.error.code === "INVALID_EMAIL_OR_PASSWORD") {
                    toast.error("Email o Password errati");
                    setIsSubmitting(false);
                    return;
                }

                // Errore non gestito ma sempre proveniente da better auth
                throw Error()
            }
        } catch (e) {
            console.error("Errore durante la fase di login", e);
            toast.error("Errore durante la fase di login");
        }

        setIsSubmitting(false);
    }
    return <div className="flex items-center min-h-screen justify-center bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
        <div className="p-8 min-w-100 bg-white rounded-2xl shadow flex flex-col gap-2">
            <img src="logo_univr.png" alt="Logo Università di Verona" className="w-54 mx-auto" />
            <h1 className="font-bold text-2xl text-center">Accedi</h1>
            <p className="text-gray-600 text-sm text-center">Piattaforma gestione career service</p>
            <form className="flex flex-col  gap-4" action={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label>Email</label>
                    <div className="relative ">
                        <FiMail className="absolute top-3 left-2 w-4 text-gray-400" />
                        <input name="email" id="email" required type="email" className="rounded-lg border w-full pl-8 border-gray-200 px-3 py-2 text-sm" placeholder="mario.rossi@gmail.com" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label>Password</label>
                    <div className="relative ">
                        <FiLock className="absolute top-3 left-2 w-4 text-gray-400" />

                        <input name="password" id="password" required type="password" className="rounded-lg border w-full pl-8 border-gray-200 px-3 py-2 text-sm" placeholder="●●●●●●●●" />
                    </div>
                </div>


                <div className="flex items-center gap-2">
                    <Checkbox name="rememberMe" />
                    <label>Ricordami</label>
                </div>

                {isSubmitting ?
                    <div className="border border-black rounded-lg py-2 flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span className="font-medium">Accesso in corso</span>
                    </div>
                    :
                    <button className="bg-black text-center w-full py-2 rounded-lg text-white font-medium hover:scale-[102%] duration-200 transition-all cursor-pointer" type="submit">Accedi</button>
                }
            </form>
        </div>
    </div>
}