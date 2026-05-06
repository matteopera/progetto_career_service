import { FiLock, FiMail } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {

    const handleSubmit = () => {
        throw Error("Da implementare")
    }
    return <div className="flex items-center min-h-screen justify-center bg-linear-to-br from-gray-100 via-blue-50 to-gray-100">
        <div className="p-8 min-w-100 bg-white rounded-2xl shadow flex flex-col gap-2">
            <img src="logo_univr.png" alt="Logo Università di Verona" className="w-54 mx-auto" />
            <h1 className="font-bold text-2xl text-center">Accedi</h1>
            <p className="text-gray-600 text-sm text-center">Piattaforma gestione career service</p>
            <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label>Email</label>
                    <div className="relative ">
                        <FiMail className="absolute top-3 left-2 w-4 text-gray-400" />

                        <input className="rounded-lg border w-full pl-8 border-gray-200 px-3 py-2 text-sm" placeholder="mario.rossi@gmail.com" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label>Password</label>
                    <div className="relative ">
                        <FiLock className="absolute top-3 left-2 w-4 text-gray-400" />

                        <input type="password" className="rounded-lg border w-full pl-8 border-gray-200 px-3 py-2 text-sm" placeholder="●●●●●●●●" />
                    </div>
                </div>


                <div className="flex items-center gap-2">
                    <Checkbox />
                    <label>Password</label>
                </div>

            </form>
        </div>
    </div>
}