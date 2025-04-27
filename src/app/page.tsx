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
}

interface Match {
  home: Team;
  away: Team;
  played: boolean;
  homeGoals?: number;
  awayGoals?: number;
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
  const [fixtures, setFixtures] = useState<Match[][]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [loading, setLoading] = useState(false);
  const [weekResults, setWeekResults] = useState<Match[]>([]);

  // Takımları getir
  const fetchTeams = async () => {
    const data = await getTeams();
    setTeams(data.teams || []);
  };

  // Fikstürü getir
  const fetchFixtures = async () => {
    setLoading(true);
    const data = await generateFixtures();
    setFixtures(data.fixtures || []);
    setCurrentWeek(0);
    setWeekResults([]);
    setLoading(false);
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
    if (!teamName || !teamPower) return;
    setLoading(true);
    await addTeam(teamName, teamPower);
    setTeamName("");
    setTeamPower(50);
    await fetchTeams();
    setLoading(false);
  };

  // Haftayı simüle et
  const handleSimulateWeek = async () => {
    setLoading(true);
    const res = await simulateWeek(currentWeek);
    setFixtures(res.fixtures || []);
    if (res.fixtures && res.fixtures[currentWeek]) {
      setWeekResults(res.fixtures[currentWeek]);
    } else {
      setWeekResults([]);
    }
    await fetchStandings();
    setCurrentWeek((w) => w + 1);
    setLoading(false);
  };

  // Tüm ligi simüle et
  const handleSimulateAll = async () => {
    setLoading(true);
    const res = await simulateAll();
    setFixtures(res.fixtures || []);
    let lastPlayedWeek = -1;
    if (res.fixtures) {
      for (let i = res.fixtures.length - 1; i >= 0; i--) {
        if (res.fixtures[i].some((m: Match) => m.played)) {
          lastPlayedWeek = i;
          break;
        }
      }
    }
    if (lastPlayedWeek >= 0) {
      setWeekResults(res.fixtures[lastPlayedWeek]);
      setCurrentWeek(lastPlayedWeek + 1);
    } else {
      setWeekResults([]);
      setCurrentWeek(0);
    }
    await fetchStandings();
    setLoading(false);
  };

  // Reset
  const handleReset = async () => {
    setLoading(true);
    await resetLeague();
    setTeams([]);
    setFixtures([]);
    setStandings([]);
    setPredictions([]);
    setCurrentWeek(0);
    setWeekResults([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700 flex items-center gap-2">
        <FaTable className="text-blue-500" /> Şampiyonlar Ligi Simülasyonu
      </h1>
      {/* Takım ekle */}
      <form
        onSubmit={handleAddTeam}
        className="flex flex-col sm:flex-row gap-2 mb-6 items-center bg-white rounded-xl shadow p-4"
      >
        <input
          type="text"
          placeholder="Takım Adı"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-blue-400 w-48"
        />
        <input
          type="number"
          min={1}
          max={100}
          value={teamPower}
          onChange={(e) => setTeamPower(Number(e.target.value))}
          className="border px-3 py-2 rounded w-32 focus:outline-blue-400"
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
        >
          <FaPlus /> Takım Ekle
        </button>
      </form>
      {/* Takım listesi */}
      <div className="mb-8 bg-white rounded-xl shadow p-4">
        <h2 className="font-bold text-lg mb-2 text-blue-700">Takımlar</h2>
        <ul className="flex flex-wrap gap-4">
          {teams.map((t, i) => (
            <li
              key={i}
              className="bg-blue-100 px-4 py-2 rounded shadow text-blue-900 font-semibold"
            >
              {t.name} <span className="text-xs text-blue-500">(Güç: {t.power})</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Fikstür oluştur ve reset */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
          onClick={fetchFixtures}
          disabled={teams.length < 2 || loading}
        >
          <FaSync /> Fikstür Oluştur
        </button>
        <button
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition"
          onClick={handleReset}
          disabled={loading}
        >
          <FaRedo /> Resetle
        </button>
      </div>
      {/* Fikstür */}
      {fixtures.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-2 text-blue-700">Fikstür</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fixtures.map((week, i) => (
              <div
                key={i}
                className="border rounded-xl shadow p-4 bg-gradient-to-br from-blue-100 to-white"
              >
                <div className="font-bold text-blue-600 mb-2">Hafta {i + 1}</div>
                {week.map((m: Match, j: number) => (
                  <div key={j} className="mb-1">
                    <span className="font-semibold text-blue-900">{m.home.name}</span>
                    <span className="mx-1 text-gray-500">-</span>
                    <span className="font-semibold text-blue-900">{m.away.name}</span>
                    {m.played && (
                      <span className="ml-2 text-green-700 font-bold">
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
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
            onClick={handleSimulateWeek}
            disabled={currentWeek >= fixtures.length || loading}
          >
            <FaPlay /> Haftayı Oynat
          </button>
          <button
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow transition"
            onClick={handleSimulateAll}
            disabled={loading}
          >
            <FaPlay /> Tüm Ligi Oynat
          </button>
        </div>
      )}
      {/* Lig Tablosu ve Haftanın Sonuçları ve Tahminler */}
      {(standings.length > 0 || weekResults.length > 0) && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lig Tablosu */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-bold text-lg mb-2 text-blue-700">Lig Tablosu</h2>
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
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
                  <tr key={i} className="text-center hover:bg-blue-50 transition">
                    <td className="font-semibold">{t.name}</td>
                    <td>{t.played}</td>
                    <td>{t.won}</td>
                    <td>{t.drawn}</td>
                    <td>{t.lost}</td>
                    <td>{t.goalsFor}</td>
                    <td>{t.goalsAgainst}</td>
                    <td>{t.goalsFor - t.goalsAgainst}</td>
                    <td className="font-bold text-blue-700">{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Haftanın Maç Sonuçları */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-bold text-lg mb-2 text-blue-700">{currentWeek}. Hafta Sonuçları</h2>
            {weekResults.length > 0 ? (
              <ul className="space-y-2">
                {weekResults.map((m: Match, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="font-semibold text-blue-900">{m.home.name}</span>
                    <span className="bg-blue-200 rounded px-2 py-0.5 font-bold">
                      {m.homeGoals}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="bg-blue-200 rounded px-2 py-0.5 font-bold">
                      {m.awayGoals}
                    </span>
                    <span className="font-semibold text-blue-900">{m.away.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">Henüz oynanmadı.</div>
            )}
          </div>
          {/* Şampiyonluk Tahminleri */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-bold text-lg mb-2 text-blue-700">Şampiyonluk Tahmini (%)</h2>
            <ul className="space-y-1">
              {standings.map((t, i) => (
                <li key={i} className="flex justify-between">
                  <span className="font-semibold text-blue-900">{t.name}</span>
                  <span className="font-bold text-blue-700">%{predictions[i] ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
