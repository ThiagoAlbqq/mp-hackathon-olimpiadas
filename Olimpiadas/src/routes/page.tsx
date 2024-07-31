import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Competitor {
  competitor_name: string;
  country_flag_url: string;
  country_id: string;
  position: number;
  result_mark: string;
  result_position: string;
  result_winnerLoserTie: "W" | "L" | "T";
}

interface EventData {
  id: number;
  day: string;
  competitors: Competitor[];
  detailed_event_name: string;
  discipline_name: string;
  discipline_pictogram: string;
  end_date: string;
  event_name: string;
  is_live: number;
  is_medal_event: number;
  name: string | null;
  start_date: string;
  status: string;
  venue_name: string;
}

export default function Page() {
  const { page = "1" } = useParams();
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(page));
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openModalgame, setOpenModalgame] = useState<boolean>(false);
  const [gameModalId, setGameModalId] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://apis.codante.io/olympic-games/events",
          {
            params: {
              page: currentPage,
            },
          }
        );
        setData(response.data.data);
        console.log(response.data.data);
        const lastPageUrl = response.data.links.last;
        const lastPageNumber = parseInt(
          new URL(lastPageUrl).searchParams.get("page") || "1"
        );
        setTotalPages(lastPageNumber);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  if (loading)
    return (
      <p className="absolute h-screen w-screen top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
        Loading...
      </p>
    );
  if (error) return <p>Error: {error.message}</p>;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/jogos/${newPage}`);
  };

  // Calculate page range to show
  const maxPagesToShow = 9;
  const halfRange = Math.floor(maxPagesToShow / 2);
  const startPage = Math.max(1, currentPage - halfRange);
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Adjust startPage if not enough pages before currentPage
  const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);

  const pageRange = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i
  );

  const handleOpenModalGame = (id: number) => {
    setOpenModalgame(true);
    setGameModalId(id);
  };

  const handleCloseModalGame = () => {
    setOpenModalgame(false);
    setGameModalId(0);
  };

  // Find the event data for the selected gameModalId
  const selectedEvent = data.find((event) => event.id === gameModalId);

  // Sort competitors by position (ranking) for the modal
  const sortedCompetitors =
    selectedEvent?.competitors.sort((a, b) => a.position - b.position) || [];

  return (
    <div className="flex flex-col justify-between container-list items-center p-20">
      <div className="max-w-[1400px]">
        <div className="space-y-10">
          <div className="flex flex-wrap gap-4 items-center container-sports justify-center text-center">
            {data.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-800 w-56 h-[350px] flex flex-col py-10 px-5 items-center justify-between space-y-5 text-white relative"
                onClick={() => handleOpenModalGame(event.id)}
              >
                <div className="flex flex-col items-center gap-5">
                  <img
                    src={event.discipline_pictogram}
                    alt={event.discipline_name}
                    className="w-16 h-16 mb-2 object-cover filter invert brightness-100 bg-transparent"
                  />
                  <div className="space-y-1">
                    <div className="text-xl font-bold">
                      {event.discipline_name}
                    </div>
                    <div>
                      <div className="text-sm">{event.event_name}</div>
                      <div className="text-sm">{event.day}</div>
                    </div>
                  </div>
                </div>
                {event.status === "Finished" ? (
                  <div className="bg-red-400 w-44 py-0.5 rounded-xl text-sm font-medium">
                    Finalizado
                  </div>
                ) : event.status === "Scheduled" ? (
                  <div className="bg-yellow-600 w-44 py-0.5 rounded-xl text-sm font-medium">
                    Agendado
                  </div>
                ) : event.status === "Rescheduled" ? (
                  <div className="bg-gray-400 w-44 py-0.5 rounded-xl text-sm font-medium">
                    Remarcado
                  </div>
                ) : event.status === "Running" ? (
                  <div className="bg-green-800 w-44 py-0.5 rounded-xl text-sm font-medium">
                    Hoje
                  </div>
                ) : event.status === "Cancelled" ? (
                  <div className="bg-red-900 w-44 py-0.5 rounded-xl text-sm font-medium">
                    Cancelado
                  </div>
                ) : (
                  <div className="bg-gray-400 w-44 py-0.5 rounded-xl text-sm font-medium">
                    Status desconhecido
                  </div>
                )}
                <div className="absolute top-0 right-3 flex flex-col space-y-2">
                  {event.is_live === 1 && (
                    <div className="bg-green-900 px-2 rounded-xl text-xs">
                      Ao vivo
                    </div>
                  )}
                  {event.is_medal_event === 1 && (
                    <div className="bg-yellow-700 px-2 rounded-xl text-xs">
                      Final
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-zinc-700 text-white rounded disabled:bg-zinc-700"
          >
            Anterior
          </button>
          {pageRange.map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`min-w-10 h-10 rounded ${
                num === currentPage
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-700 text-white"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-zinc-700 text-white rounded disabled:bg-zinc-700"
          >
            Próxima
          </button>
        </div>
        <span className="text-sm text-zinc-400">
          Página {currentPage} de {totalPages}
        </span>
      </div>

      {openModalgame && selectedEvent && (
        <div className="w-screen h-screen bg-black absolute top-0 bg-opacity-35 flex items-center justify-center">
          <div className="text-white w-[550px] bg-zinc-900 h-[600px] p-10 relative overflow-auto space-y-5 shadow-custom2">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-bold max-w-72">
                {selectedEvent.detailed_event_name}
              </h2>
              <button
                onClick={handleCloseModalGame}
                className="bg-red-500 text-white rounded p-1 px-2"
              >
                Fechar
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2">Competidores:</h3>
            <ul className="space-y-2">
              {sortedCompetitors.map((competitor) => (
                <div key={competitor.competitor_name}>
                  {competitor.country_id !== "" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 py-2">
                        <img
                          src={competitor.country_flag_url}
                          alt={competitor.country_id}
                          className="w-8 h-5"
                        />
                        <div>
                          {competitor.competitor_name && (
                            <div className="font-bold">
                              {competitor.competitor_name}
                            </div>
                          )}
                          {competitor.result_mark && (
                            <div className="text-sm">
                              Marca: {competitor.result_mark}
                            </div>
                          )}
                          {competitor.result_position && (
                            <div className="text-sm">
                              Posição: {competitor.result_position}
                            </div>
                          )}
                        </div>
                      </div>
                      {competitor.result_winnerLoserTie === "W" && (
                        <div className="text-yellow-700">Winner</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
