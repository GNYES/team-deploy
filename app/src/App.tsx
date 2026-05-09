import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores';
import TabBar from '@/components/TabBar';
import Header from '@/components/Header';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Deploy from '@/pages/Deploy';
import Leaderboard from '@/pages/Leaderboard';
import Income from '@/pages/Income';
import Community from '@/pages/Community';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 pb-20">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Header />
                <main className="pt-14 px-4">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/deploy" element={<Deploy />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <TabBar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
