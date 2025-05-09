"use client";
import { useEffect, useState } from "react";
import {
  addTeam,
  getTeams,
  generateFixtures,
  simulateWeek,
  simulateAll,
  getStandings,
  resetLeague,
} from "../utils/api";
import { FaPlus, FaSync, FaPlay, FaRedo, FaTable } from "react-icons/fa";

interface Team {
  name: string;
  power: number;
  points?: number;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
}

interface Match {
  home: Team;
  away: Team;
  played: boolean;
  homeGoals: number | null;
  awayGoals: number | null;
}

interface WeekFixture {
  week: number;
  matches: Match[];
}

interface Standing {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamPower, setTeamPower] = useState(50);
  const [fixtures, setFixtures] = useState<WeekFixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading] = useState(false);
  const [weekResults, setWeekResults] = useState<Match[]>([]);
  const [loadingAddTeam, setLoadingAddTeam] = useState(false);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingSimulateWeek, setLoadingSimulateWeek] = useState(false);
  const [loadingSimulateAll, setLoadingSimulateAll] = useState(false);

  // Takımları getir
  const fetchTeams = async () => {
    const data = await getTeams();
    setTeams(data.teams || []);
  };

  // Fikstürü getir
  const fetchFixtures = async () => {
    setLoadingFixtures(true);
    const data = await generateFixtures();
    setFixtures(data.fixtures || []);
    setCurrentWeek(1);
    setWeekResults([]);
    setStandings([]);
    setPredictions([]);
    setLoadingFixtures(false);
  };

  // Lig tablosunu getir
  const fetchStandings = async () => {
    const data = await getStandings();
    setStandings(data.standings || []);
    setPredictions(data.predictions || []);
  };

  // Takım ekle
  const handleAddTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (teams.length >= 4) return;
    if (!teamName || teamPower < 0 || teamPower > 100) return;
    setLoadingAddTeam(true);
    await addTeam(teamName, teamPower);
    setTeamName("");
    setTeamPower(50);
    await fetchTeams();
    setLoadingAddTeam(false);
  };

  // Haftayı simüle et
  const handleSimulateWeek = async () => {
    setLoadingSimulateWeek(true);
    const res = await simulateWeek(currentWeek);
    setFixtures(res.fixtures || []);
    if (res.fixtures && res.fixtures[currentWeek - 1]) {
      setWeekResults(res.fixtures[currentWeek - 1].matches);
    } else {
      setWeekResults([]);
    }
    await fetchStandings();
    setCurrentWeek((w) => w + 1);
    setLoadingSimulateWeek(false);
  };

  // Tüm ligi simüle et
  const handleSimulateAll = async () => {
    setLoadingSimulateAll(true);
    const res = await simulateAll();
    setFixtures(res.fixtures || []);
    let lastPlayedWeek = -1;
    if (res.fixtures) {
      for (let i = res.fixtures.length - 1; i >= 0; i--) {
        if (res.fixtures[i].matches.some((m: Match) => m.played)) {
          lastPlayedWeek = i;
          break;
        }
      }
    }
    if (lastPlayedWeek >= 0) {
      setWeekResults(res.fixtures[lastPlayedWeek].matches);
      setCurrentWeek(lastPlayedWeek + 1);
    } else {
      setWeekResults([]);
      setCurrentWeek(1);
    }
    await fetchStandings();
    setLoadingSimulateAll(false);
  };

  // Reset
  const handleReset = async () => {
    setLoadingReset(true);
    await resetLeague();
    setTeams([]);
    setFixtures([]);
    setStandings([]);
    setPredictions([]);
    setCurrentWeek(1);
    setWeekResults([]);
    setLoadingReset(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a2236] py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-100 flex items-center gap-2 drop-shadow">
          <FaTable className="text-blue-400" /> Şampiyonlar Ligi Simülasyonu
        </h1>
        {/* Takım ekle kuralları */}
        <div className="mb-2 text-blue-300 text-sm font-semibold">
          <ul className="list-disc list-inside">
            <li>Maksimum takım sayısı: 4</li>
            <li>Takım gücü 0 ile 100 arasında olmalıdır</li>
          </ul>
        </div>
        {/* Takım ekle */}
        <form
          onSubmit={handleAddTeam}
          className="flex flex-col sm:flex-row gap-2 mb-6 items-center bg-[#232b47] rounded-2xl shadow-xl p-6 border border-[#3a4270]"
        >
          <input
            type="text"
            placeholder="Takım Adı"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="border border-[#3a4270] bg-[#1a2236] text-blue-100 px-3 py-2 rounded focus:outline-blue-400 w-48 placeholder:text-blue-300"
            disabled={teams.length >= 4}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={teamPower}
            onChange={(e) => setTeamPower(Number(e.target.value))}
            className="border border-[#3a4270] bg-[#1a2236] text-blue-100 px-3 py-2 rounded w-32 focus:outline-blue-400 placeholder:text-blue-300"
            disabled={teams.length >= 4}
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#3a4270] hover:bg-[#4b5a8a] active:bg-[#2e3657] active:scale-95 text-white px-4 py-2 rounded-xl shadow transition font-bold cursor-pointer"
            disabled={teams.length >= 4 || loadingAddTeam}
          >
            {loadingAddTeam ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaPlus />} Takım Ekle
          </button>
        </form>
        {/* Takım listesi */}
        <div className="mb-8 bg-[#232b47] rounded-2xl shadow-xl p-6 border border-[#3a4270]">
          <h2 className="font-bold text-lg mb-2 text-blue-100">Takımlar</h2>
          <ul className="flex flex-wrap gap-4">
            {teams.map((t, i) => (
              <li
                key={i}
                className="bg-[#2e3657] px-4 py-2 rounded shadow text-blue-100 font-semibold border border-[#3a4270]"
              >
                {t.name} <span className="text-xs text-blue-400">(Güç: {t.power})</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Fikstür oluştur ve reset */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className="flex items-center gap-2 bg-[#3a4270] hover:bg-[#4b5a8a] active:bg-[#2e3657] active:scale-95 text-white px-4 py-2 rounded-xl shadow transition font-bold cursor-pointer"
            onClick={fetchFixtures}
            disabled={teams.length < 2 || loadingFixtures}
          >
            {loadingFixtures ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaSync />} Fikstür Oluştur
          </button>
          <button
            className="flex items-center gap-2 bg-[#6b2236] hover:bg-[#a23a47] active:bg-[#4b1a2a] active:scale-95 text-white px-4 py-2 rounded-xl shadow transition font-bold cursor-pointer"
            onClick={handleReset}
            disabled={loadingReset}
          >
            {loadingReset ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaRedo />} Resetle
          </button>
        </div>
        {/* Fikstür */}
        {fixtures.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-2 text-blue-100">Fikstür</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fixtures.map((week: WeekFixture) => (
                <div
                  key={week.week}
                  className="border border-[#3a4270] rounded-2xl shadow-xl p-4 bg-gradient-to-br from-[#232b47] to-[#2e3657]"
                >
                  <div className="font-bold text-blue-400 mb-2">Hafta {week.week}</div>
                  {week.matches.map((m: Match, j: number) => (
                    <div key={j} className="mb-1 text-blue-100">
                      <span className="font-semibold">{m.home.name}</span>
                      <span className="mx-1 text-blue-300">-</span>
                      <span className="font-semibold">{m.away.name}</span>
                      {m.played && (
                        <span className="ml-2 text-green-400 font-bold">
                          ({m.homeGoals} - {m.awayGoals})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Simülasyon butonları */}
        {fixtures.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              className="flex items-center gap-2 bg-[#2e3657] hover:bg-[#3a4270] active:bg-[#232b47] active:scale-95 text-white px-4 py-2 rounded-xl shadow transition font-bold cursor-pointer"
              onClick={handleSimulateWeek}
              disabled={currentWeek > fixtures.length || loadingSimulateWeek}
            >
              {loadingSimulateWeek ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaPlay />} Haftayı Oynat
            </button>
            <button
              className="flex items-center gap-2 bg-[#2e3657] hover:bg-[#3a4270] active:bg-[#232b47] active:scale-95 text-white px-4 py-2 rounded-xl shadow transition font-bold cursor-pointer"
              onClick={handleSimulateAll}
              disabled={loadingSimulateAll}
            >
              {loadingSimulateAll ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaPlay />} Tüm Ligi Oynat
            </button>
          </div>
        )}
        {/* Lig Tablosu ve Haftanın Sonuçları ve Tahminler */}
        {(standings.length > 0 || weekResults.length > 0) && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lig Tablosu */}
            <div className="bg-[#232b47] rounded-2xl shadow-xl p-4 border border-[#3a4270]">
              <h2 className="font-bold text-lg mb-2 text-blue-100">Lig Tablosu</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <table className="w-full border border-[#3a4270] text-sm rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-[#2e3657] text-blue-100">
                      <th className="p-1">Takım</th>
                      <th className="p-1">O</th>
                      <th className="p-1">G</th>
                      <th className="p-1">B</th>
                      <th className="p-1">M</th>
                      <th className="p-1">A</th>
                      <th className="p-1">Y</th>
                      <th className="p-1">AV</th>
                      <th className="p-1">P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((t, i) => (
                      <tr key={i} className="text-center hover:bg-[#2e3657] transition text-blue-100">
                        <td className="font-semibold">{t.name}</td>
                        <td>{t.played}</td>
                        <td>{t.won}</td>
                        <td>{t.drawn}</td>
                        <td>{t.lost}</td>
                        <td>{t.goalsFor}</td>
                        <td>{t.goalsAgainst}</td>
                        <td>{t.goalsFor - t.goalsAgainst}</td>
                        <td className="font-bold text-blue-400">{t.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Haftanın Maç Sonuçları */}
            <div className="bg-[#232b47] rounded-2xl shadow-xl p-4 border border-[#3a4270]">
              <h2 className="font-bold text-lg mb-2 text-blue-100">{currentWeek}. Hafta Sonuçları</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                weekResults.length > 0 ? (
                  <ul className="space-y-2">
                    {weekResults.map((m: Match, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-blue-100">
                        <span className="font-semibold">{m.home.name}</span>
                        <span className="bg-blue-900 rounded px-2 py-0.5 font-bold text-blue-100">
                          {m.homeGoals}
                        </span>
                        <span className="text-blue-300">-</span>
                        <span className="bg-blue-900 rounded px-2 py-0.5 font-bold text-blue-100">
                          {m.awayGoals}
                        </span>
                        <span className="font-semibold">{m.away.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-blue-300">Henüz oynanmadı.</div>
                )
              )}
            </div>
            {/* Şampiyonluk Tahminleri */}
            <div className="bg-[#232b47] rounded-2xl shadow-xl p-4 border border-[#3a4270]">
              <h2 className="font-bold text-lg mb-2 text-blue-100">Şampiyonluk Tahmini (%)</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <ul className="space-y-1">
                  {standings.map((t, i) => (
                    <li key={i} className="flex justify-between text-blue-100">
                      <span className="font-semibold">{t.name}</span>
                      <span className="font-bold text-blue-400">%{predictions[i] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
