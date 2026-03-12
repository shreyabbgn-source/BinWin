import { UserProfile, Reward } from '../types';
import { useState, useEffect } from 'react';
import { getRewards } from '../services/db';
import { Gift, Star, Clock, ChevronRight } from 'lucide-react';

interface RewardsProps {
  user: UserProfile | null;
}

export default function Rewards({ user }: RewardsProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    const unsub = getRewards(setRewards);
    return () => unsub();
  }, []);

  const categories = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment'];
  const filteredRewards = category === 'All' ? rewards : rewards.filter(r => r.category === category);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Eco-Rewards</h1>
          <p className="text-emerald-600">Redeem your hard-earned points for sustainable rewards.</p>
        </div>
        {user && (
          <div className="bg-white px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase">Your Balance</p>
              <p className="text-xl font-bold text-emerald-900">{user.points} Points</p>
            </div>
          </div>
        )}
      </header>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-emerald-100 transition-all">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={reward.imageUrl || `https://picsum.photos/seed/${reward.id}/400/300`}
                  alt={reward.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-xs font-bold shadow-sm">
                    {reward.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">{reward.title}</h3>
                <p className="text-sm text-emerald-500 mb-6 line-clamp-2">{reward.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>{reward.pointsCost}</span>
                  </div>
                  <button
                    disabled={!user || user.points < reward.pointsCost}
                    className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                      user && user.points >= reward.pointsCost
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-emerald-50 text-emerald-300 cursor-not-allowed'
                    }`}
                  >
                    Redeem
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Gift className="mx-auto text-emerald-100 w-16 h-16 mb-4" />
            <p className="text-emerald-400">No rewards found in this category.</p>
          </div>
        )}
      </div>

      {/* Featured / Info */}
      <section className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">How to earn more?</h2>
          <p className="text-emerald-200 mb-6">
            Every 1kg of plastic earns you 50 points. Glass and Paper earn 30 points. 
            Level up to unlock exclusive premium rewards!
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Clock size={18} />
              <span className="text-sm">Daily Bonus: +10 pts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Star size={18} />
              <span className="text-sm">Streak: 5 days</span>
            </div>
          </div>
        </div>
        <Star className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 rotate-12" />
      </section>
    </div>
  );
}
