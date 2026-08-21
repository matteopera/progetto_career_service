import { Calendar, Database, FormIcon, Users } from "lucide-react";

export default function Dashboard() {
  const cardDatas = [
    {
      id: 1,
      name: "Form Creati",
      value: 5,
      icon: FormIcon,
    },
    {
      id: 1,
      name: "Totale Dati Raccolti",
      value: 5,
      icon: Database,
    },
    {
      id: 1,
      name: "Prossimo Evento",
      value: "12/06/2026",
      icon: Calendar,
    },
    {
      id: 1,
      name: "Iscritti Prossimo Evento",
      value: 5,
      icon: Users,
    },
  ];
  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-3xl">Dashboard</h1>
      <p className="text-sm text-gray-500">
        Pagina dove verranno mostrati dei dati (es. nr form compilati, nr form
        creati, nr aziende ...), grafici dei relativi dati e forse log?
      </p>

      {/* cardData */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
        {cardDatas.map((data) => (
          <div
            key={data.id}
            className="border flex justify-between items-start rounded-xl shadow-xs p-4 w-full"
          >
            <div className="">
              {/* titolo */}
              <span className="text-sm font-medium text-gray-500">
                {data.name}
              </span>
              <p className="text-2xl mt-2 font-bold">{data.value}</p>
            </div>
            <div className=" shadow  rounded-lg p-4">
              <data.icon className="text-black w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Tabella ultime aziende */}
      <div className="border shadow rounded-xl h-80 mt-8 p-4">
        <h1 className="font-medium text-xl">Ultime aziende registrate</h1>
      </div>
      {/* Tabella ultimi form */}
      <div className="border shadow rounded-xl h-80 mt-8 p-8">
        <h1 className="font-medium text-xl">Ultime form creati</h1>
      </div>
    </div>
  );
}
