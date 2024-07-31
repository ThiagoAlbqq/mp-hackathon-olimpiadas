import { Link } from "react-router-dom";

interface TopBarProps {
  active: string;
  selectActive: (item: string) => void;
}

export default function TopBar({ active, selectActive }: TopBarProps) {
  return (
    <div className="bg-zinc-900 w-screen border-b-2 border-zinc-800 h-20 flex items-center justify-between text-white px-20">
      <div className="text-xl font-bold">Olympic Games</div>
      <div className="flex gap-5 items-center">
        <Link
          to={"/home"}
          className={`rounded-full px-3 py-1 cursor-pointer ${
            active === "lista de esportes" && "bg-zinc-700"
          }`}
          onClick={() => selectActive("lista de esportes")}
        >
          Lista de Esportes
        </Link>
        <Link
          to={"/jogos/166"}
          className={`rounded-full px-3 py-1 cursor-pointer ${
            active === "lista de jogos" && "bg-zinc-700"
          }`}
          onClick={() => selectActive("lista de jogos")}
        >
          Lista de Jogos
        </Link>
        <Link
          to={"/medalhas"}
          className={`rounded-full px-3 py-1 cursor-pointer ${
            active === "medalhas e paises" && "bg-zinc-700"
          }`}
          onClick={() => selectActive("medalhas e paises")}
        >
          Medalhas e Paises
        </Link>
      </div>
    </div>
  );
}
