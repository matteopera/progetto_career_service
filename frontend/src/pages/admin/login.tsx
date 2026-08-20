import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createAuthClient } from "better-auth/react";
import z from "zod";
import { loginSchema, type LoginType } from "@/type/Login";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";

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

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

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
    <div className="w-screen h-full flex max-lg:flex-col min-h-screen lg:p-4 bg-gray-50000/10">
      <div className="lg:w-1/2 bg-black/80 max-lg:h-32 lg:min-h-full hidden lg:block  relative lg:rounded-xl max-lg:rounded-b-xl  overflow-hidden">
        <div className="bg-[url(/sede_univr.jpg)]  rounded-2xl bg-no-repeat bg-cover min-h-full absolute -z-10 w-full "></div>
        <div className="text-white relative h-full flex items-center backdrop-blur-xs px-24">
          <div className=" max-lg:px-8 flex lg:flex-col gap-6 text-start">
            <img src="logo_univr_short_white.png" className="w-24" />
            <p className="text-2xl lg:text-4xl font-semibold ">
              Gestionale Eventi Career Service
            </p>
            <p className="max-lg:hidden text-white/70 text-lg">
              Creazione form, raccolta dati delle aziende con creazione
              automatica di PDF ed esportazione excel in un'unica piattaform
            </p>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 flex lg:items-center mx-3 py-8 justify-center ">
        <div className="lg:w-140 mx-4">
          <div className="flex items-center lg:hidden lg:justify-center ">
            <img
              src="logo_univr_short.png"
              alt="Logo Università di Verona"
              className="w-14 mr-4 lg:hidden"
            />
            <p className="text-xl font-bold lg:text-center">
              Gestionale Eventi Career Service
            </p>
          </div>
          <h1 className="max-lg:mt-12 font-semibold text-3xl lg:text-4xl text-center ">
            Bentornato
          </h1>
          <p className="text-gray-500 mt-4  text-center ">
            Inserisci l'email e la password per accedere alla piattaforma
          </p>
          <form
            className="flex flex-col lg:min-h-full mt-8 gap-2 lg:gap-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label className=" inline font-semibold" htmlFor="email">
                Email
              </label>
              <div className="relative ">
                <FiMail
                  size={18}
                  className="absolute top-4 left-4 text-gray-500"
                />
                <Input
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
                  className={`pl-11  ${errorFormData.email !== "" && "border-red-500"}`}
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
                <FiLock
                  size={18}
                  className="absolute top-4 left-4 text-gray-500"
                />

                <Input
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
                  type={passwordVisible ? "text" : "password"}
                  className={`pl-11 ${errorFormData.password !== "" && "border-red-500"}`}
                  placeholder="●●●●●●●●"
                />
                {passwordVisible ? (
                  <FiEyeOff
                    size={18}
                    className="absolute top-4 right-4 text-gray-500 cursor-pointer"
                    onClick={() => setPasswordVisible(false)}
                  />
                ) : (
                  <FiEye
                    size={18}
                    className="absolute top-4 right-4 text-gray-500 cursor-pointer"
                    onClick={() => setPasswordVisible(true)}
                  />
                )}

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
                onCheckedChange={(value: boolean) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: value,
                  }))
                }
                name="rememberMe"
                className="w-4.5 h-4.5"
              />
              <label htmlFor="rememberMe" className="text-gray-800">
                Ricorda accesso
              </label>
            </div>

            {isSubmitting ? (
              <div className="border border-black rounded-lg py-4 lg:py-3 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="font-medium">Accesso in corso</span>
              </div>
            ) : (
              <button
                className="bg-black text-center w-full py-4 lg:py-3 rounded-lg text-white font-medium hover:scale-[102%] duration-200 transition-all cursor-pointer"
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
