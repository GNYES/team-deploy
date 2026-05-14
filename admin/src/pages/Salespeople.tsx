import { useAdminStore } from '@/stores/adminStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, UserIcon, DevicePhoneMobileIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Salespeople() {
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
          <h1 className="text-2xl font-bold text-slate-800">业务员设备数量</h1>
          <p className="text-slate-500 mt-1">查看每个业务员的设备铺设情况</p>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          {users.map((user) => (
            <div 
              key={user.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.team}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-slate-800">{user.devices}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-cyan-500" />
                  <span className="font-bold text-slate-800">{user.rings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
