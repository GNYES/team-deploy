import { useAdminStore } from '@/stores/adminStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DevicePhoneMobileIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function NDeviceAnalysis() {
  const navigate = useNavigate();
  const deviceAnalyses = useAdminStore((s) => s.deviceAnalyses);
  const analyzeDeviceData = useAdminStore((s) => s.analyzeDeviceData);

  const latestAnalysis = deviceAnalyses[deviceAnalyses.length - 1];

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
          <h1 className="text-2xl font-bold text-slate-800">N设备数据分析</h1>
          <p className="text-slate-500 mt-1">单独分析N设备的铺设和使用情况</p>
        </div>
      </div>

      {latestAnalysis ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-4">{latestAnalysis.totalUsers}</p>
              <p className="text-slate-500 text-sm">总用户数</p>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-4">{latestAnalysis.qualifiedUsers}</p>
              <p className="text-slate-500 text-sm">达标用户</p>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-4">{latestAnalysis.unqualifiedUsers}</p>
              <p className="text-slate-500 text-sm">未达标用户</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4">详细记录</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-4 py-3 rounded-tl-lg">用户</th>
                    <th className="px-4 py-3">团队</th>
                    <th className="px-4 py-3">设备数</th>
                    <th className="px-4 py-3">状态</th>
                    <th className="px-4 py-3 rounded-tr-lg">备注</th>
                  </tr>
                </thead>
                <tbody>
                  {latestAnalysis.records.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{record.userName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{record.team}</td>
                      <td className="px-4 py-3 text-sm text-blue-600 font-medium">{record.deviceCount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'qualified' ? 'bg-emerald-100 text-emerald-700' :
                          record.status === 'unqualified' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {record.status === 'qualified' ? '达标' :
                           record.status === 'unqualified' ? '未达标' : '未开始'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{record.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">暂无设备数据分析</p>
            <button 
              onClick={analyzeDeviceData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              开始分析
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
