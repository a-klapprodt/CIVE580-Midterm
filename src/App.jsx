import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function generateData() {
  const data = [];
  const today = new Date();

  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const rainfall = Math.random() * 50;
    const fs = 1.6 - rainfall * 0.012 + Math.random() * 0.08;

    data.push({
      date: date.toLocaleDateString(),
      rainfall: Number(rainfall.toFixed(1)),
      factorOfSafety: Number(fs.toFixed(2)),
    });
  }
  return data;
}

const data = generateData();

export default function App() {
  const [threshold, setThreshold] = useState(1.3);
  const [population, setPopulation] = useState(1000);
  const [usage, setUsage] = useState(150);

  const totalLoad = useMemo(() => {
    return population * usage;
  }, [population, usage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-green-900">The Green Lens</h1>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          Rainfall-induced slope instability is driven by increased pore water
          pressure, reducing effective stress and shear strength. This
          dashboard visualizes how rainfall influences Factor of Safety over
          time.
        </p>
      </header>

      <div className="max-w-4xl mx-auto mb-8">
        <label className="block text-xl font-semibold mb-3">
          Factor of Safety Threshold: {threshold}
        </label>
        <input
          type="range"
          min="0.8"
          max="2"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto mb-12">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <ReferenceLine
              y={threshold}
              stroke="red"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="factorOfSafety"
              stroke="#065f46"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.factorOfSafety < threshold) {
                  return <circle cx={cx} cy={cy} r={5} fill="red" />;
                }
                return <circle cx={cx} cy={cy} r={3} fill="#065f46" />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-green-900">
          Impact Calculator
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">Population</label>
            <input
              type="number"
              value={population}
              onChange={(e) => setPopulation(Number(e.target.value))}
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Daily Usage per Capita
            </label>
            <input
              type="number"
              value={usage}
              onChange={(e) => setUsage(Number(e.target.value))}
              className="w-full border p-3 rounded-xl"
            />
          </div>
        </div>

        <div className="mt-6 text-2xl font-bold text-blue-800">
          Total Daily Load: {totalLoad.toLocaleString()} units
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-green-100 border-l-4 border-green-700 p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">AI Interpretation</h3>
        <p>
          As rainfall increases, pore water pressure rises, reducing effective
          stress within the soil mass. This reduction lowers shear strength and
          decreases the Factor of Safety. When the Factor of Safety drops below
          the selected threshold, instability risk increases significantly.
        </p>
      </div>

      <footer className="text-center mt-16 text-gray-600">
        Amelia Klapprodt — Spring 2026
      </footer>
    </div>
  );
}
