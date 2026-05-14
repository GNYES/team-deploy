import { useAdminStore } from '@/stores/adminStore';
import { UsersIcon, DevicePhoneMobileIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const stats = useAdminStore((s) => s.getStats)();
  const users = useAdminStore((s) => s.users);
  const navigate = useNavigate();

  const totalSalespeople = users.length;
  const qualifiedSalespeople = users.filter(u => u.devices >= 20).length;
  const totalSalary = stats.monthIncome;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">数据看板</h1>
        <p className="text-slate-500 mt-1">查看团队整体运营数据</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div 
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/device-breakdown')}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{stats.totalDevices}</p>
          <p className="text-slate-500 text-sm">总设备数</p>
        </div>

        <div 
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/salespeople')}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{totalSalespeople}</p>
          <p className="text-slate-500 text-sm">业务员数量</p>
        </div>

        <div 
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/qualified-comparison')}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-cyan-600" />
            </div>
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{qualifiedSalespeople}</p>
          <p className="text-slate-500 text-sm">达标人数</p>
        </div>

        <div 
          className="stat-card cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/salary-details')}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
            </div>
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-4">¥{totalSalary.toLocaleString()}</p>
          <p className="text-slate-500 text-sm">总薪资</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">小蓝环总数</h3>
        <p className="text-4xl font-bold text-cyan-600">{stats.totalRings}</p>
      </div>
    </div>
  );
}
