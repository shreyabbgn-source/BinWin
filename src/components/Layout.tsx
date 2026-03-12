import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Gift, QrCode, History, MessageSquare, LogIn, LogOut, User } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  user: UserProfile | null;
}

export default function Layout({ user }: LayoutProps) {
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
    { path: '/scan', icon: QrCode, label: 'Scan Bin' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/contact', icon: MessageSquare, label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col md:flex-row">
      {/* Sidebar / Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 md:relative md:w-64 md:border-t-0 md:border-r md:h-screen z-50">
        <div className="flex flex-col h-full">
          <div className="hidden md:flex items-center gap-2 p-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <QrCode className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-emerald-900">BinWin</span>
          </div>

          <div className="flex md:flex-col flex-row justify-around md:justify-start md:gap-2 p-2 md:p-4 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Icon size={24} />
                  <span className="hidden md:block font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block p-4 border-t border-emerald-100">
            {user ? (
              <div className="flex items-center gap-3 p-2">
                <img src={user.photoURL || 'https://picsum.photos/seed/user/40/40'} alt="Profile" className="w-10 h-10 rounded-full border-2 border-emerald-200" referrerPolicy="no-referrer" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-emerald-900 truncate">{user.displayName}</p>
                  <p className="text-xs text-emerald-600">{user.points} Points</p>
                </div>
                <button onClick={handleLogout} className="text-emerald-400 hover:text-emerald-600 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 h-screen">
        <header className="md:hidden bg-white p-4 flex justify-between items-center border-b border-emerald-100 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <QrCode className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-emerald-900">BinWin</span>
          </div>
          {user ? (
            <img src={user.photoURL || 'https://picsum.photos/seed/user/40/40'} alt="Profile" className="w-8 h-8 rounded-full border-2 border-emerald-200" referrerPolicy="no-referrer" />
          ) : (
            <button onClick={handleLogin} className="text-emerald-600">
              <LogIn size={24} />
            </button>
          )}
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
