import { useAdminStore } from '@/stores/adminStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function RingAnalysis() {
  const navigate = useNavigate();
  const users = useAdminStore((s) => s.users);
  const teams = useAdminStore((s) => s.teams);

  // Calculate total rings
  const totalRings = users.reduce((sum, user) => sum + user.rings, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">小蓝环数据分析</h1>
          <p className="text-slate-500 mt-1">单独分析小蓝环的铺设情况</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{totalRings}</p>
          <p className="text-slate-500 text-sm">总小蓝环数</p>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{users.length}</p>
          <p className="text-slate-500 text-sm">铺设人数</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">按团队分布</h3>
        <div className="space-y-4">
          {teams.map((team) => (
            <div 
              key={team.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{team.name}</p>
                  <p className="text-sm text-slate-500">{team.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-cyan-500" />
                <span className="font-bold text-slate-800">{team.rings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">按业务员分布</h3>
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <span className="text-slate-800">{user.name}</span>
              <span className="font-bold text-cyan-600">{user.rings}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
