import { useAdminStore } from '@/stores/adminStore';
import { UsersIcon, DevicePhoneMobileIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const stats = useAdminStore((s) => s.getStats)();
  const teams = useAdminStore((s) => s.teams);
  const deployRecords = useAdminStore((s) => s.deployRecords);

  const chartData = [
    { name: '周一', devices: 45, rings: 23 },
    { name: '周二', devices: 52, rings: 28 },
    { name: '周三', devices: 48, rings: 25 },
    { name: '周四', devices: 61, rings: 32 },
    { name: '周五', devices: 55, rings: 29 },
    { name: '周六', devices: 67, rings: 35 },
    { name: '周日', devices: 42, rings: 22 },
  ];

  const recentRecords = deployRecords.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">控制台</h1>
        <p className="text-slate-500 mt-1">查看团队整体运营数据</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">{stats.totalUsers}</p>
          <p className="text-slate-500 text-sm">总用户数</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DevicePhoneMobileIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">{stats.totalDevices}</p>
          <p className="text-slate-500 text-sm">铺设设备总数</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <MapPinIcon className="w-6 h-6 text-cyan-600" />
            </div>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">{stats.totalRings}</p>
          <p className="text-slate-500 text-sm">小蓝环总数</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">{stats.totalTeams}</p>
          <p className="text-slate-500 text-sm">团队数量</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">铺设趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="devices" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorDevices)" />
                <Area type="monotone" dataKey="rings" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">团队排名</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teams.slice(0, 5)} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={60} />
                <Tooltip />
                <Bar dataKey="devices" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">最近铺设记录</h3>
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3 rounded-tl-lg">日期</th>
              <th className="px-4 py-3">成员</th>
              <th className="px-4 py-3">团队</th>
              <th className="px-4 py-3">地点</th>
              <th className="px-4 py-3">设备</th>
              <th className="px-4 py-3 rounded-tr-lg">蓝环</th>
            </tr>
          </thead>
          <tbody>
            {recentRecords.map((record) => (
              <tr key={record.id} className="table-row">
                <td className="px-4 py-3 text-sm text-slate-600">{record.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{record.userName}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{record.team}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{record.location}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{record.devices}</td>
                <td className="px-4 py-3 text-sm text-cyan-600 font-medium">{record.rings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
