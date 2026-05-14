import { useAdminStore } from '@/stores/adminStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function QualifiedComparison() {
  const navigate = useNavigate();
  const users = useAdminStore((s) => s.users);

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
          <h1 className="text-2xl font-bold text-slate-800">业务员与昨日对比</h1>
          <p className="text-slate-500 mt-1">达标情况对比分析</p>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          {users.map((user) => {
            const isQualified = user.devices >= 20;
            return (
              <div 
                key={user.id}
                className={`p-4 rounded-xl ${isQualified ? 'bg-emerald-50' : 'bg-red-50'}">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isQualified ? (
                      <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{user.devices} 台设备</p>
                    <p className={`text-sm ${isQualified ? 'text-emerald-600' : 'text-red-600'}">
                      {isQualified ? '已达标' : '未达标'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
