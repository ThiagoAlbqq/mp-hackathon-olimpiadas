import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import TopBar from "./components/topbar";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    if (location.pathname.startsWith("/home")) {
      setActive("lista de esportes");
    } else if (location.pathname.startsWith("/jogos")) {
      setActive("lista de jogos");
    } else {
      setActive("medalhas e paises");
    }
  }, [location]);

  function selectActive(item: string) {
    setActive(item);
  }

  return (
    <>
      <TopBar active={active} selectActive={selectActive} />
      <Outlet />
    </>
  );
}

export default App;
