import axios from "axios";
import { useEffect, useState } from "react";

interface EventData {
  id: number;
  name: string;
  pictogram_url: string;
  pictogram_url_dark: string;
}

export default function Home() {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://apis.codante.io/olympic-games/disciplines"
        );
        setData(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col justify-between container-list items-center p-20 h-full">
      <div className="max-w-[1400px]">
        <div className="space-y-10">
          <div className="flex flex-wrap gap-4 items-center justify-center text-center container-sports">
            {data.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-800 w-56 h-[350px] flex flex-col py-10 px-5 items-center justify-center space-y-5 text-white relative shadow-custom1"
              >
                <div className="flex flex-col items-center gap-5">
                  <img
                    src={event.pictogram_url}
                    alt={event.name}
                    className="w-16 h-16 mb-2 object-cover filter invert brightness-100 bg-transparent"
                  />
                  <div className="space-y-1">
                    <div className="text-xl font-bold">{event.name}</div>
                    <div>
                      <div className="text-sm">{event.name}</div>
                      <div className="text-sm">{event.id}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
