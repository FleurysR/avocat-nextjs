import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Lun', 'Dossiers': 4, 'Recherches': 24 },
  { name: 'Mar', 'Dossiers': 3, 'Recherches': 18 },
  { name: 'Mer', 'Dossiers': 5, 'Recherches': 32 },
  { name: 'Jeu', 'Dossiers': 2, 'Recherches': 21 },
  { name: 'Ven', 'Dossiers': 6, 'Recherches': 45 },
];

export const ActivityChart = () => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité de la semaine</h3>
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} labelStyle={{color: '#cbd5e1'}}/>
                    <Bar dataKey="Dossiers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Recherches" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);
