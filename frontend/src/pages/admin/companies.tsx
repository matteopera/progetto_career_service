import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";

export default function Companies() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }
  if (!session || !session.user) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-3xl">Aziende</h1>
      <p className="text-sm text-gray-500">
        Esplora i dati delle aziende ricevute
      </p>
    </div>
  );
}
