import { UserProfile } from '../types';
import { useState } from 'react';
import { Camera, QrCode, ShieldCheck, AlertCircle } from 'lucide-react';
import { addRecyclingEvent, getUserProfile, createUserProfile } from '../services/db';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

interface QRScannerProps {
  user: UserProfile | null;
}

export default function QRScanner({ user }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ weight: number; points: number } | null>(null);

  const simulateScan = async () => {
    if (!user) return;
    setScanning(true);
    
    // Simulate API call to smart bin
    setTimeout(async () => {
      const weight = parseFloat((Math.random() * 5 + 0.5).toFixed(1));
      const points = Math.floor(weight * 50);
      
      try {
        // 1. Add history record
        await addRecyclingEvent({
          userId: user.uid,
          binId: 'bin_central_01',
          weight,
          pointsEarned: points,
          timestamp: new Date(),
          type: 'Plastic'
        });

        // 2. Update user points and weight
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(points),
          totalRecycledWeight: increment(weight)
        });

        setResult({ weight, points });
      } catch (error) {
        console.error('Scan processing error:', error);
      } finally {
        setScanning(false);
      }
    }, 2000);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="text-emerald-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Sign in to Scan</h2>
        <p className="text-emerald-600 max-w-xs">You need to be logged in to track your recycling and earn points.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-emerald-900">Scan Smart Bin</h1>
        <p className="text-emerald-600">Point your camera at the QR code on the bin.</p>
      </header>

      <div className="relative aspect-square bg-emerald-900 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-200 flex flex-col items-center justify-center border-8 border-white">
        {scanning ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-emerald-200 font-bold">Processing waste...</p>
          </div>
        ) : result ? (
          <div className="text-center p-8 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/50">
              <ShieldCheck className="text-white w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
            <p className="text-emerald-200 mb-6">You recycled {result.weight}kg of plastic.</p>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-emerald-300 uppercase font-bold">Points Earned</p>
              <p className="text-4xl font-bold text-white">+{result.points}</p>
            </div>
            <button 
              onClick={() => setResult(null)}
              className="mt-8 text-emerald-300 font-bold hover:text-white transition-colors"
            >
              Scan Another Bin
            </button>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-emerald-400 rounded-3xl"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400 animate-pulse"></div>
            </div>
            <Camera className="text-emerald-400/50 w-24 h-24 mb-4" />
            <button
              onClick={simulateScan}
              className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-all active:scale-95"
            >
              Start Scanning
            </button>
          </>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex gap-4">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900">How it works</h4>
          <p className="text-sm text-emerald-500 mt-1">
            Find a BinWin smart bin, scan the QR code to unlock, drop your waste, and wait for the weight confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
