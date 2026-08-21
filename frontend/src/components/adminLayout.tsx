import { cn } from "@/lib/utils";
import {
  Factory,
  FormIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
    active: true,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Recupero account

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
    <div className="min-h-screen w-full flex max-lg:flex-col relative ">
      <aside
        className={cn(
          "max-lg:hidden sticky left-0 h-screen top-0 w-80 max-md:w-3/5 flex flex-col bg-white border-r shadow transition-all duration-250",
          isMobile &&
            "fixed z-50 top-0 left-0 bottom-0 inset-0 overflow-y-hidden",
          !menuVisible && isMobile && "-translate-x-100",
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
          <div className="flex gap-2 items-center ">
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
                  "cursor-pointer flex gap-3 items-center px-4 py-1.5 rounded-lg transition-all duration-200 text-black",
                  location.pathname === item.href
                    ? "bg-black/10"
                    : "hover:bg-stone-400/10 ",
                )}
              >
                <item.icon className="w-4 h-4" />
                <p className="">{item.title}</p>
              </a>
            ) : (
              <Tooltip key={item.id}>
                <TooltipTrigger>
                  <div
                    className={cn(
                      "flex gap-3 items-center px-4 py-1.5  text-stone-500",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
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
          <div className="border-t p-4 flex items-center gap-2">
            <div className="w-10 h-10 text-sm bg-black rounded-full text-white font-medium flex items-center justify-center">
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

      {isMobile ||
        (1 == 2 && (
          <Button
            onClick={() => setMenuVisible(true)}
            variant={"ghost"}
            className="mt-2 ml-2 "
          >
            <Menu className="h-6! w-6!" />
          </Button>
        ))}

      {/* CONTENUTO PAGINA */}
      <div
        className={cn(
          "min-h-full p-8 w-full bg-gray-50/10",
          menuVisible && isMobile && " bg-black/70 overlay",
        )}
        onClick={
          menuVisible && isMobile ? () => setMenuVisible(false) : () => {}
        }
      >
        {children}
      </div>

      {/* Menù navigazione mobile */}
      <div className="lg:hidden bg-white border-t sticky bottom-0 p-4 flex justify-around  shadow w-full">
        {itemsMenu.map((item) =>
          item.active ? (
            <a
              key={item.id}
              onClick={() => handleChangePage(item.href)}
              className={cn(
                "cursor-pointer w-25 flex gap-2 items-center justify-center rounded-full transition-all duration-200  flex-col",
                location.pathname === item.href
                  ? "text-black"
                  : " text-stone-500",
              )}
            >
              <item.icon className="w-6 h-6" />
              <p className="font-medium text-xs">{item.title}</p>
            </a>
          ) : (
            <Popover key={item.id}>
              <PopoverTrigger>
                <div
                  className={cn(
                    "flex gap-3 items-center w-25 text-stone-400/50 flex-col",
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <p className="font-medium text-xs">{item.title}</p>
                </div>
              </PopoverTrigger>
              <PopoverContent side="top">
                In arrivo prossimamente...
              </PopoverContent>
            </Popover>
          ),
        )}
      </div>
    </div>
  );
}
