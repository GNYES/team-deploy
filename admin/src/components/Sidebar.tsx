import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, UsersIcon, UserGroupIcon, DocumentChartBarIcon, 
  CurrencyDollarIcon, ArrowsRightLeftIcon, Cog6ToothIcon,
  SignalIcon, DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/', icon: HomeIcon, label: '控制台' },
  { path: '/users', icon: UsersIcon, label: '用户管理' },
  { path: '/teams', icon: UserGroupIcon, label: '团队管理' },
  { path: '/records', icon: DocumentChartBarIcon, label: '铺设记录' },
  { path: '/salary', icon: CurrencyDollarIcon, label: '工资配置' },
  { path: '/device-analysis', icon: DevicePhoneMobileIcon, label: '碰一下设备' },
  { path: '/import-export', icon: ArrowsRightLeftIcon, label: '导入导出' },
  { path: '/settings', icon: Cog6ToothIcon, label: '系统设置' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <SignalIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">TeamDeploy</h1>
            <p className="text-xs text-slate-500">管理后台</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`sidebar-link w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">管理员</p>
            <p className="text-xs text-slate-400">系统管理员</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
