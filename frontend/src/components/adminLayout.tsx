import { cn } from "@/lib/utils";
import {
  Factory,
  FormIcon,
  LayoutDashboard,
  Loader,
  Loader2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const itemsMenu = [
  {
    id: 1,
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    active: true,
  },
  {
    id: 2,
    title: "Aziende",
    icon: Factory,
    href: "/companies",
    active: true,
  },
  {
    id: 3,
    title: "Form",
    icon: FormIcon,
    href: "/forms",
    active: false,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Recupero account
  const { data: session } = authClient.useSession();

  // Gestione navigazione
  const location = useLocation();
  const navigate = useNavigate();

  // Gestione responsive
  const isMobile = useIsMobile(768);

  // Gestione responsive sidebar in mobile e cambio rotte
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const handleChangePage = (href: string) => {
    navigate(href);
    setMenuVisible(false);
  };

  // Gestione logout
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      toast("Logout eseguito con successo!");
    } catch (e: any) {
      toast.error("Errore durante il logout");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative">
      {menuVisible || !isMobile ? (
        <aside
          className={cn(
            "w-68 max-md:w-3/5 flex flex-col bg-white border-r shadow",
            isMobile &&
              "fixed z-50 top-0 left-0 bottom-0 inset-0 overflow-y-scroll",
          )}
        >
          {menuVisible && isMobile && (
            <X
              className="absolute top-2 right-2"
              onClick={() => setMenuVisible(false)}
            />
          )}
          {/* Titolo e immagine Univr */}
          <div className="border-b p-4">
            <div className="flex  gap-2   items-center ">
              <img
                src="logo_univr_short.png"
                alt="Logo Università di Verona"
                className="w-18 h-18"
              />
              <h2 className="font-semibold text-2xl ">
                Career
                <br />
                service
              </h2>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              Gestionale Recruiting Day
            </p>
          </div>
          {/* Elementi menù */}
          <div className="flex flex-col gap-2 p-2 mt-4">
            {itemsMenu.map((item) =>
              item.active ? (
                <a
                  key={item.id}
                  onClick={() => handleChangePage(item.href)}
                  className={cn(
                    "cursor-pointer flex gap-3 items-center p-3 rounded-3xl transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-stone-800 text-white"
                      : "hover:bg-stone-100 text-stone-700",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <p className="font-medium">{item.title}</p>
                </a>
              ) : (
                <Tooltip key={item.id}>
                  <TooltipTrigger>
                    <div
                      className={cn(
                        "flex gap-3 items-center p-3 rounded text-stone-500",
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <p className="">{item.title}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    In arrivo prossimamente...
                  </TooltipContent>
                </Tooltip>
              ),
            )}
          </div>
          <div className="mt-auto">
            <div className="border-t px-2 py-4 flex items-center gap-2">
              <div className="w-12 h-12 bg-black rounded-full text-white font-medium flex items-center justify-center">
                {session?.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{session?.user.name}</span>
                <span className="text-sm text-gray-600">Amministratore</span>
              </div>
              <div className="ml-auto min-h-full!">
                <Button
                  onClick={handleLogout}
                  variant={"destructive"}
                  className="min-h-full!"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <LogOut />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        <Button
          onClick={() => setMenuVisible(true)}
          variant={"ghost"}
          className="mt-2 ml-2 "
        >
          <Menu className="h-6! w-6!" />
        </Button>
      )}

      <div
        className={cn(
          "flex-1 z-0 pt-2 px-4 flex",
          menuVisible && isMobile && "pointer-events-none bg-black/70 overlay",
        )}
      >
        {children}
      </div>
    </div>
  );
}
