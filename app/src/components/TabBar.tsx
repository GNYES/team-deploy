import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, MapPinIcon, ChartBarIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/24/outline';

const tabs = [
  { path: '/', icon: HomeIcon, label: '首页' },
  { path: '/deploy', icon: MapPinIcon, label: '铺设' },
  { path: '/leaderboard', icon: ChartBarIcon, label: '排行' },
  { path: '/income', icon: CurrencyDollarIcon, label: '工资' },
  { path: '/community', icon: UsersIcon, label: '社区' },
];

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
