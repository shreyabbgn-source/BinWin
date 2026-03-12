import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { getUserProfile, createUserProfile } from './services/db';
import { UserProfile } from './types';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import QRScanner from './pages/QRScanner';
import History from './pages/History';
import Contact from './pages/Contact';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seedData = async () => {
      const rewardsSnap = await getDocs(collection(db, 'rewards'));
      if (rewardsSnap.empty) {
        const initialRewards = [
          { title: 'Free Coffee', description: 'Get a free organic coffee at GreenBean Cafe.', pointsCost: 500, category: 'Food', imageUrl: 'https://picsum.photos/seed/coffee/400/300' },
          { title: 'Bus Pass (1 Day)', description: 'Unlimited city bus travel for 24 hours.', pointsCost: 1200, category: 'Transport', imageUrl: 'https://picsum.photos/seed/bus/400/300' },
          { title: '$10 Eco-Store Voucher', description: 'Valid at all participating sustainable shops.', pointsCost: 2000, category: 'Shopping', imageUrl: 'https://picsum.photos/seed/voucher/400/300' },
          { title: 'Cinema Ticket', description: 'One standard ticket for any movie.', pointsCost: 1500, category: 'Entertainment', imageUrl: 'https://picsum.photos/seed/cinema/400/300' },
          { title: 'Plant a Tree', description: 'We will plant a tree in your name in the Amazon.', pointsCost: 3000, category: 'Shopping', imageUrl: 'https://picsum.photos/seed/tree/400/300' },
        ];
        for (const reward of initialRewards) {
          await addDoc(collection(db, 'rewards'), reward);
        }
      }

      const binsSnap = await getDocs(collection(db, 'bins'));
      if (binsSnap.empty) {
        const initialBins = [
          { locationName: 'Central Park North', type: 'Plastic', status: 'Empty', latitude: 40.785091, longitude: -73.968285 },
          { locationName: 'Times Square East', type: 'Glass', status: 'Half-Full', latitude: 40.758896, longitude: -73.985130 },
          { locationName: 'Brooklyn Bridge Entry', type: 'Paper', status: 'Full', latitude: 40.706086, longitude: -73.996864 },
        ];
        for (const bin of initialBins) {
          await addDoc(collection(db, 'bins'), bin);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Eco Hero',
            photoURL: firebaseUser.photoURL || '',
            points: 0,
            totalRecycledWeight: 0,
            level: 1,
            badges: ['Newcomer'],
            role: 'user'
          };
          await createUserProfile(profile);
        }
        setUser(profile);
        // Seed data once authenticated (or if we want it public, we can move it out)
        seedData();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="rewards" element={<Rewards user={user} />} />
          <Route path="scan" element={<QRScanner user={user} />} />
          <Route path="history" element={<History user={user} />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
