import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  const titles: Record<string, string> = {
    '/': '团队铺设管理',
    '/deploy': '铺设记录',
    '/leaderboard': '团队排行',
    '/income': '工资详情',
    '/community': '社区交流',
    '/achievements': '成就中心',
    '/profile': '个人中心',
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-slate-100 z-40 safe-top">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <div className="w-10">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>
        <h1 className="text-base font-semibold text-slate-900">{titles[location.pathname] || 'TeamDeploy'}</h1>
        <div className="w-10" />
      </div>
    </header>
  );
}
