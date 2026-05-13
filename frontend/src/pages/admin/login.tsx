import { FiLock, FiMail } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createAuthClient } from "better-auth/react";
import z from "zod";
import { loginSchema, type LoginType } from "@/type/Login";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  // Gestione del form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginType>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errorFormData, setErrorFormData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // verifico se dati form sono ok
    const result = loginSchema.safeParse({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      setErrorFormData({
        email: flattened.fieldErrors.email?.join(" ") || "",
        password: flattened.fieldErrors.password?.join(" ") || "",
      });
      setIsSubmitting(false);
      return;
    }

    // Dati ok, procedo con login utente
    try {
      const authClient = createAuthClient();

      const response = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: "/dashboard",
      });

      // Controllo se login andato a buon fine
      if (!response.data && response.error !== null) {
        console.error("Errore durante richiesta di login", response.error);
        // Errore proveniente da better auth
        if (response.error.code === "INVALID_EMAIL_OR_PASSWORD") {
          toast.error("Email o Password errati");
          setIsSubmitting(false);
          return;
        }
        console.log(response);

        // Errore non gestito ma sempre proveniente da better auth
        throw Error("Errore login lato Better Auth");
      }
    } catch (e) {
      console.error("Errore durante la fase di login", e);
      toast.error("Errore durante la fase di login");
    }

    setIsSubmitting(false);
  };

  // Controllo se utente già loggato
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }

  if (session && session.user) {
    navigate("/dashboard");
    return <></>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen  ">
      <div className="bg-black/60 min-h-screen max-lg:hidden min-w-full relative ">
        <div className="bg-[url(/sede_univr.jpg)] bg-no-repeat bg-cover min-h-full absolute -z-10 min-w-full bg-"></div>
      </div>
      <div className="flex items-center justify-center ">
        <div className="w-100 mx-4 max-lg:border max-lg:p-4 max-lg:shadow max-lg:rounded-xl">
          <img
            src="logo_univr.png"
            alt="Logo Università di Verona"
            className="w-64 mx-auto mb-4"
          />
          <h1 className="font-bold text-3xl text-center">Accedi</h1>
          <p className="text-gray-600 text-center mt-2 mb-3">
            Piattaforma gestione career service
          </p>
          <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className=" inline font-semibold" htmlFor="email">
                Email
              </label>
              <div className="relative ">
                <FiMail className="absolute top-4 left-2.5 w-4 text-gray-400" />
                <input
                  onFocus={() =>
                    setErrorFormData((prev) => ({ ...prev, email: "" }))
                  }
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={isSubmitting}
                  name="email"
                  id="email"
                  required
                  type="email"
                  className={`rounded-lg border w-full pl-8 border-gray-200 px-3 py-3 text-sm ${errorFormData.email !== "" && "border-red-500"}`}
                  placeholder="mario.rossi@gmail.com"
                />
                <p className="text-red-500 text-sm mt-2">
                  {errorFormData.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="email">
                Password
              </label>
              <div className="relative ">
                <FiLock className="absolute top-4 left-2.5 w-4 text-gray-400" />

                <input
                  onFocus={() =>
                    setErrorFormData((prev) => ({ ...prev, password: "" }))
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  name="password"
                  id="password"
                  required
                  type="password"
                  className={`rounded-lg border w-full pl-8 border-gray-200 px-3 py-3 text-sm ${errorFormData.password !== "" && "border-red-500"}`}
                  placeholder="●●●●●●●●"
                />
                <p className="text-red-500 text-sm mt-2">
                  {errorFormData.password}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Checkbox
                id="rememberMe"
                disabled={isSubmitting}
                checked={formData.rememberMe}
                onCheckedChange={(v) =>
                  setFormData((prev) => ({ ...prev, rememberMe: v === true }))
                }
                name="rememberMe"
              />
              <label htmlFor="rememberMe">Ricordami</label>
            </div>

            {isSubmitting ? (
              <div className="border border-black rounded-lg py-3 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="font-medium">Accesso in corso</span>
              </div>
            ) : (
              <button
                className="bg-black text-center w-full py-3 rounded-lg text-white font-medium hover:scale-[102%] duration-200 transition-all cursor-pointer"
                type="submit"
              >
                Accedi
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
