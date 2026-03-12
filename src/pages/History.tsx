import { UserProfile, RecyclingHistory } from '../types';
import { useState, useEffect } from 'react';
import { getHistory } from '../services/db';
import { History as HistoryIcon, Download, Filter, Search, Recycle } from 'lucide-react';

interface HistoryProps {
  user: UserProfile | null;
}

export default function History({ user }: HistoryProps) {
  const [history, setHistory] = useState<RecyclingHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      const unsub = getHistory(user.uid, setHistory);
      return () => unsub();
    }
  }, [user]);

  const filteredHistory = history.filter(item => 
    item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.binId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <HistoryIcon className="text-emerald-100 w-20 h-20 mb-6" />
        <h2 className="text-2xl font-bold text-emerald-900">Sign in to view history</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Recycling History</h1>
          <p className="text-emerald-600">Track your environmental impact over time.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-100 rounded-xl text-emerald-600 font-bold hover:bg-emerald-50 transition-colors">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
          <input
            type="text"
            placeholder="Search by type or bin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-emerald-100 rounded-2xl text-emerald-600 font-bold">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-50/50">
                <th className="p-4 text-xs font-bold text-emerald-600 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-emerald-600 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-bold text-emerald-600 uppercase tracking-wider">Weight</th>
                <th className="p-4 text-xs font-bold text-emerald-600 uppercase tracking-wider">Points</th>
                <th className="p-4 text-xs font-bold text-emerald-600 uppercase tracking-wider">Bin ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="p-4">
                      <p className="text-emerald-900 font-medium">{item.timestamp?.toDate().toLocaleDateString()}</p>
                      <p className="text-[10px] text-emerald-400">{item.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                          <Recycle size={16} />
                        </div>
                        <span className="text-emerald-900 font-medium">{item.type || 'Plastic'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-emerald-900 font-bold">{item.weight} kg</td>
                    <td className="p-4">
                      <span className="text-emerald-600 font-bold">+{item.pointsEarned}</span>
                    </td>
                    <td className="p-4 text-emerald-400 font-mono text-xs">{item.binId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-emerald-400">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
