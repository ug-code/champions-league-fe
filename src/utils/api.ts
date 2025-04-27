const API_URL = "http://127.0.0.1:8000/api";

export async function addTeam(name: string, power: number) {
  const res = await fetch(`${API_URL}/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, power }),
  });
  return res.json();
}

export async function getTeams() {
  const res = await fetch(`${API_URL}/teams`);
  return res.json();
}

export async function generateFixtures() {
  const res = await fetch(`${API_URL}/fixtures`, { method: "POST" });
  return res.json();
}

export async function simulateWeek(week: number) {
  const res = await fetch(`${API_URL}/simulate-week`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ week }),
  });
  return res.json();
}

export async function simulateAll() {
  const res = await fetch(`${API_URL}/simulate-all`, { method: "POST" });
  return res.json();
}

export async function getStandings() {
  const res = await fetch(`${API_URL}/standings`);
  return res.json();
}

export async function resetLeague() {
  const res = await fetch(`${API_URL}/reset`, { method: "POST" });
  return res.json();
} 