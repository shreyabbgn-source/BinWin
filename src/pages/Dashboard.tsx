import { UserProfile, RecyclingHistory, Bin } from '../types';
import { useState, useEffect } from 'react';
import { getHistory, getBins } from '../services/db';
import { Trophy, Leaf, MapPin, ArrowUpRight, Recycle } from 'lucide-react';

interface DashboardProps {
  user: UserProfile | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [history, setHistory] = useState<RecyclingHistory[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    if (user) {
      const unsubHistory = getHistory(user.uid, setHistory);
      const unsubBins = getBins(setBins);
      return () => {
        unsubHistory();
        unsubBins();
      };
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <Leaf className="text-emerald-600 w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">Welcome to BinWin</h1>
        <p className="text-emerald-600 max-w-md mb-8">
          Join our community of eco-warriors. Recycle smart, earn points, and redeem amazing rewards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {[
            { icon: MapPin, title: 'Find Bins', desc: 'Locate smart bins near you' },
            { icon: Recycle, title: 'Recycle', desc: 'Scan and drop your waste' },
            { icon: Trophy, title: 'Earn', desc: 'Get points for every kg' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
              <item.icon className="text-emerald-600 mb-3" size={24} />
              <h3 className="font-bold text-emerald-900">{item.title}</h3>
              <p className="text-xs text-emerald-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-emerald-900">Hello, {user.displayName}!</h1>
        <p className="text-emerald-600">You're doing great. Keep recycling!</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Total Points</p>
            <h2 className="text-5xl font-bold mt-2">{user.points}</h2>
            <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs">
              <ArrowUpRight size={14} />
              <span>Level {user.level} Eco Hero</span>
            </div>
          </div>
          <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
          <p className="text-emerald-500 text-sm font-medium uppercase tracking-wider">Recycled Weight</p>
          <h2 className="text-4xl font-bold text-emerald-900 mt-2">{user.totalRecycledWeight} <span className="text-xl text-emerald-400">kg</span></h2>
          <div className="mt-4 h-2 bg-emerald-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(user.totalRecycledWeight % 10) * 10}%` }}></div>
          </div>
          <p className="text-xs text-emerald-400 mt-2">{(10 - (user.totalRecycledWeight % 10)).toFixed(1)}kg more for next level</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
          <p className="text-emerald-500 text-sm font-medium uppercase tracking-wider">Active Badges</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {user.badges.map((badge, i) => (
              <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-emerald-900">Recent Activity</h3>
            <button className="text-emerald-600 text-sm font-bold">View All</button>
          </div>
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
            {history.length > 0 ? (
              <div className="divide-y divide-emerald-50">
                {history.map((item) => (
                  <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-emerald-50/50 transition-colors">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <Recycle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-emerald-900">{item.weight}kg {item.type || 'Recycling'}</p>
                      <p className="text-xs text-emerald-400">{item.timestamp?.toDate().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">+{item.pointsEarned}</p>
                      <p className="text-[10px] text-emerald-400 uppercase font-bold">Points</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-emerald-400">No recycling activity yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Nearby Bins */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-emerald-900">Nearby Smart Bins</h3>
            <button className="text-emerald-600 text-sm font-bold">Map View</button>
          </div>
          <div className="space-y-4">
            {bins.length > 0 ? (
              bins.slice(0, 3).map((bin) => (
                <div key={bin.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    bin.status === 'Full' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-emerald-900">{bin.locationName}</h4>
                    <p className="text-xs text-emerald-400">{bin.type} Bin • {bin.status}</p>
                  </div>
                  <div className="text-right">
                    <div className={`w-2 h-2 rounded-full inline-block ${
                      bin.status === 'Full' ? 'bg-red-500' : bin.status === 'Half-Full' ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-emerald-100 text-center">
                <p className="text-emerald-400">Loading nearby bins...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
