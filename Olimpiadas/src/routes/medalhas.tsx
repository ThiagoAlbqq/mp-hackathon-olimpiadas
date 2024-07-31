import axios from "axios";
import { useEffect, useState } from "react";

interface MedalCounts {
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
}

interface Country {
  id: string;
  name: string;
  continent: string;
  flag_url: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
  rank: number;
  rank_total_medals: number;
}

interface PaginationLinks {
  first: string;
  last: string;
  prev: string;
  next: string;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface CountryDataResponse {
  data: Country[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export default function Medalhas() {
  const [data, setData] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CountryDataResponse>(
          "https://apis.codante.io/olympic-games/countries"
        );
        setData(response.data.data);
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

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-8 text-white">Medalhas por País</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] w-full">
        {data.map((country) => (
          <div
            key={country.id}
            className="bg-zinc-800 text-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            <img
              src={country.flag_url}
              alt={`${country.name} flag`}
              className="w-24 h-16 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{country.name}</h2>
            <p className="text-sm mb-2">Rank: {country.rank}</p>
            <p className="text-sm mb-2">Total Medals: {country.total_medals}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm">
                Gold: {country.gold_medals}
              </span>
              <span className="bg-gray-400 text-black px-2 py-1 rounded-full text-sm">
                Silver: {country.silver_medals}
              </span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-sm">
                Bronze: {country.bronze_medals}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
