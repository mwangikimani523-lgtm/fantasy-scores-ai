import React, { useEffect, useState } from "react";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Mock data - replace with your API
  async function fetchMockData() {
    return [
      {
        id: "match_1",
        competition: "English Premier League",
        home: "Leeds",
        away: "West Ham",
        score: "2 - 1",
        time: "72'",
        scorers: [
          { player: "Sam Greenwood", team: "Leeds", minute: 34 },
          { player: "E. Phillips", team: "Leeds", minute: 58 },
          { player: "Michail Antonio", team: "West Ham", minute: 67 }
        ],
        assists: [
          { player: "Raphinha", team: "Leeds", minute: 34 },
          { player: "Luke Ayling", team: "Leeds", minute: 58 },
          { player: "Emerson", team: "West Ham", minute: 67 }
        ],
        topProbabilities: [
          { player: "Sam Greenwood", prob: 0.18 },
          { player: "E. Phillips", prob: 0.12 },
          { player: "Michail Antonio", prob: 0.09 }
        ],
        shotsOnTarget: [
          { player: "Sam Greenwood", sot: 3 },
          { player: "Michail Antonio", sot: 2 }
        ]
      },
      {
        id: "match_2",
        competition: "Europa League",
        home: "Feyenoord",
        away: "Aston Villa",
        score: "1 - 0",
        time: "HT",
        scorers: [{ player: "C. Dessers", team: "Feyenoord", minute: 41 }],
        assists: [{ player: "S. Berghuis", team: "Feyenoord", minute: 41 }],
        topProbabilities: [
          { player: "C. Dessers", prob: 0.22 },
          { player: "O. Watkins", prob: 0.1 }
        ],
        shotsOnTarget: [{ player: "C. Dessers", sot: 1 }]
      }
    ];
  }

  async function fetchMatches() {
    setLoading(true);
    try {
      // Replace with your API: const res = await fetch('/api/matches'); const data = await res.json();
      const data = await fetchMockData();
      setMatches(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch matches", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-black font-bold text-lg">⚽</div>
            <div>
              <h1 className="text-2xl font-semibold">Fantasy Scores AI — Live Feed</h1>
              <p className="text-sm text-gray-400">Public dashboard · Dark mode · Live match feed first</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <div>Last updated:</div>
            <div className="font-medium text-gray-200">{lastUpdated ? lastUpdated.toLocaleString() : "—"}</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {loading && (
          <div className="py-12 text-center text-gray-400">Loading live matches...</div>
        )}

        {!loading && matches.length === 0 && (
          <div className="py-12 text-center text-gray-400">No active matches at the moment.</div>
        )}

        <section className="grid gap-4">
          {matches.map((m) => (
            <article key={m.id} className="bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-400">{m.competition}</div>
                    <div className="text-xl font-bold mt-1">{m.home} <span className="text-green-300">{m.score}</span> {m.away}</div>
                    <div className="text-sm text-gray-400 mt-1">{m.time}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                    <div className="text-xs text-gray-400">Top Scorers (prob.)</div>
                    <ul className="mt-2 space-y-1">
                      {m.topProbabilities.map((p, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm">
                          <span>{p.player}</span>
                          <span className="text-gray-300 font-semibold">{Math.round(p.prob * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                    <div className="text-xs text-gray-400">Recent Scorers</div>
                    <ul className="mt-2 space-y-1 text-sm">
                      {m.scorers.map((s, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{s.player} <span className="text-gray-400">({s.team})</span></span>
                          <span className="text-gray-300">{s.minute}'</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                    <div className="text-xs text-gray-400">Assists & SOT</div>
                    <div className="mt-2 text-sm">
                      <div className="mb-2">
                        <div className="text-xs text-gray-400">Assists</div>
                        <ul className="mt-1 space-y-1">
                          {m.assists.map((a, i) => (
                            <li key={i}>{a.player} <span className="text-gray-500">({a.team})</span></li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400">Shots on Target</div>
                        <ul className="mt-1 space-y-1">
                          {m.shotsOnTarget.map((s, i) => (
                            <li key={i}>{s.player} — {s.sot} SOT</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-56">
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-3 border border-gray-700">
                  <div className="text-xs text-gray-400">Quick actions (public)</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <button className="w-full py-2 rounded-lg bg-green-500 text-black font-medium">View match details</button>
                    <button className="w-full py-2 rounded-lg border border-gray-700 text-sm text-gray-300">Download JSON</button>
                    <button className="w-full py-2 rounded-lg border border-gray-700 text-sm text-gray-300">Share link</button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 text-center">Public — no login required</div>
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Built with ❤️ for Fantasy Scores AI · Replace mock data with your API at <span className="font-mono">/api/matches</span>
        </footer>
      </main>
    </div>
  );
}
