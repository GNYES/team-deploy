import { useAdminStore } from '@/stores/adminStore';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export default function DeviceBreakdown() {
  const { province } = useParams<{ province?: string }>();
  const navigate = useNavigate();
  const teams = useAdminStore((s) => s.teams);

  // Group devices by province (from team regions)
  const provinceData: Record<string, number> = {};
  teams.forEach((team) => {
    const region = team.region || '未知';
    provinceData[region] = (provinceData[region] || 0) + team.devices;
  });

  // City data (mock)
  const cityData: Record<string, Record<string, number>> = {
    '华东': { '上海': 60, '杭州': 30, '南京': 21 },
    '华南': { '广州': 40, '深圳': 27 },
    '华北': { '北京': 35, '天津': 22 },
    '西南': { '成都': 32, '重庆': 20 },
    '西北': { '西安': 18 }
  };

  if (province) {
    const cities = cityData[province] || {};
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
            <h1 className="text-2xl font-bold text-slate-800">{province}设备分布</h1>
            <p className="text-slate-500 mt-1">按城市查看设备数量</p>
          </div>
        </div>

        <div className="card">
          <div className="space-y-4">
            {Object.entries(cities).map(([city, count]) => (
              <div 
                key={city}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-slate-800">{city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-slate-800">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-800">设备省份分布</h1>
          <p className="text-slate-500 mt-1">点击省份查看城市分布</p>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          {Object.entries(provinceData).map(([region, count]) => (
            <div 
              key={region}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100"
              onClick={() => navigate(`/device-breakdown/${region}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-slate-800">{region}</span>
              </div>
              <div className="flex items-center gap-2">
                <DevicePhoneMobileIcon className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-slate-800">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
