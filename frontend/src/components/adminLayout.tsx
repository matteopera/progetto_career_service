import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {

    return <div className="min-h-screen w-full flex">

        <aside className="w-1/8 flex flex-col p-4">
            {/* Titolo e immagine Univr */}

        </aside>
        <div className="w-7/8">{children}</div>
    </div>

}