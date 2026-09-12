export default function iscrizioneEffettuata(){
    return(
        <div>
            <nav className="border-b border-gray-300">
        <img
          src="/logo_univr.png"
          alt="Logo Università di Verona"
          className="w-54 mx-auto "
        />
      </nav>
        <div className=" ml-7 mr-7 md:ml-32 md:mr-32 items-center justify-center border p-5 border-gray-400 rounded-2xl mt-3 ">
            <div className=" flex flex-col gap-2 items-start sm:flex sm:flex-row sm:items-center justify-between w-full   ">
                <h1 className="text-4xl font-bold">Iscrizione inoltrata</h1>
                <span className="bg-green-100 text-green-700 p-1 pl-3 pr-3 rounded-2xl">Ricevuta</span>
            </div>
            <p className="text-gray-400 text-xl mt-4">La sua iscrizione è stata registrata correttamente, riceverà una notifica appena verrà confermata</p>
        </div>
        </div>
    )
}