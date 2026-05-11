import { useState, useRef } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { DocumentArrowUpIcon, CheckCircleIcon, XCircleIcon, ClockIcon, DevicePhoneMobileIcon, CurrencyYenIcon, ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function DeviceAnalysis() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importDeviceData = useAdminStore((s) => s.importDeviceData);
  const analyzeDeviceData = useAdminStore((s) => s.analyzeDeviceData);
  const calculateSalary = useAdminStore((s) => s.calculateSalary);
  const getDeviceAnalysisHistory = useAdminStore((s) => s.getDeviceAnalysisHistory);
  const devicePrice = useAdminStore((s) => s.devicePrice);
  const baseSalary = useAdminStore((s) => s.baseSalary);
  const updateDevicePrice = useAdminStore((s) => s.updateDevicePrice);

  const [uploadResult, setUploadResult] = useState<{ success: boolean; count: number; message: string } | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ReturnType<typeof analyzeDeviceData> | null>(null);
  const [salaryCalculations, setSalaryCalculations] = useState<ReturnType<typeof calculateSalary>>([]);
  const [priceInput, setPriceInput] = useState(devicePrice.toString());

  const history = getDeviceAnalysisHistory();
  const latestHistory = history[history.length - 1];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const deviceData = jsonData.map((row: any) => ({
          userName: row['姓名'] || row['userName'] || '',
          phone: row['手机号'] || row['phone'] || '',
          team: row['团队'] || row['team'] || '默认团队',
          date: row['日期'] || row['date'] || new Date().toISOString().split('T')[0],
          checkInCount: Number(row['打卡次数'] || row['checkInCount'] || 0),
          onlineDays30: Number(row['30天满22天'] || row['onlineDays30'] || 0),
          onlineDays10: Number(row['30天满10天'] || row['onlineDays10'] || 0),
          onlinePersons20: Number(row['30天满20人'] || row['onlinePersons20'] || 0),
          deviceCount: Number(row['设备台数'] || row['deviceCount'] || 0),
          note: row['备注'] || row['note'] || '',
        }));

        importDeviceData(deviceData);
        const analysis = analyzeDeviceData();
        setCurrentAnalysis(analysis);
        const salaries = calculateSalary();
        setSalaryCalculations(salaries);

        setUploadResult({
          success: true,
          count: deviceData.length,
          message: `成功导入 ${deviceData.length} 条数据并完成分析`
        });
      } catch (error) {
        setUploadResult({
          success: false,
          count: 0,
          message: '导入失败：文件格式错误，请确保Excel列名正确'
        });
      }
    };
    reader.readAsArrayBuffer(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePriceUpdate = () => {
    const newPrice = Number(priceInput);
    if (newPrice > 0) {
      updateDevicePrice(newPrice);
      if (currentAnalysis) {
        const salaries = calculateSalary();
        setSalaryCalculations(salaries);
      }
    }
  };

  const handleExportSalary = () => {
    if (salaryCalculations.length === 0) return;

    const data = salaryCalculations.map((s, idx) => ({
      '序号': idx + 1,
      '姓名': s.userName,
      '团队': s.team,
      '状态': s.status === 'qualified' ? '达标' : s.status === 'unqualified' ? '未达标' : '未开机',
      '底薪': s.baseSalary,
      '设备台数': s.deviceCount,
      '设备单价': s.devicePrice,
      '设备金额': s.deviceTotal,
      '应发金额': s.grossSalary,
      '达标条件': s.qualifiedConditions.join(', ') || '无',
      '未达标条件': s.unqualifiedConditions.join(', ') || '无',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '工资明细');
    XLSX.writeFile(wb, `碰一下设备工资表_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        '姓名': '张三',
        '手机号': '13800138001',
        '团队': '华东战队',
        '30天满22天': 22,
        '30天满10天': 10,
        '30天满20人': 20,
        '打卡次数': 12,
        '设备台数': 50,
        '备注': '',
      },
      {
        '姓名': '李四',
        '手机号': '13800138002',
        '团队': '华南战队',
        '30天满22天': 18,
        '30天满10天': 8,
        '30天满20人': 15,
        '打卡次数': 10,
        '设备台数': 35,
        '备注': '',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '模板');
    XLSX.writeFile(wb, '碰一下设备导入模板.xlsx');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">碰一下设备分析</h1>
        <p className="text-slate-500 mt-1">上传设备数据，自动分析达标情况并计算工资</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
            达标条件说明
          </h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">条件一：30天满22天</p>
              <p className="text-blue-600 text-xs mt-1">统计30天内在线天数是否达到22天</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-800">条件二：30天满10天</p>
              <p className="text-purple-600 text-xs mt-1">统计30天内在线天数是否达到10天</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <p className="font-medium text-emerald-800">条件三：30天满20人</p>
              <p className="text-emerald-600 text-xs mt-1">统计30天内服务人数是否达到20人</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="font-medium text-amber-800">条件四：打卡次数</p>
              <p className="text-amber-600 text-xs mt-1">30天打卡12次 或 7天打卡4次</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-medium text-slate-800">工资计算</p>
              <p className="text-slate-600 text-xs mt-1">应发金额 = 底薪({baseSalary}元) + 设备台数 × 单价</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CurrencyYenIcon className="w-5 h-5 text-emerald-600" />
            工资配置
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">底薪 (元)</label>
              <input
                type="number"
                value={baseSalary}
                className="input-field bg-slate-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">设备单价 (元/台)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="input-field flex-1"
                />
                <button
                  onClick={handlePriceUpdate}
                  className="btn-primary"
                >
                  更新
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DocumentArrowUpIcon className="w-5 h-5 text-blue-600" />
            数据上传
          </h3>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <DocumentArrowUpIcon className="w-5 h-5" />
              选择Excel文件上传
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="w-full py-2 px-4 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              下载导入模板
            </button>
          </div>
        </div>
      </div>

      {uploadResult && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          uploadResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {uploadResult.success ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <XCircleIcon className="w-5 h-5" />
          )}
          <span>{uploadResult.message}</span>
        </div>
      )}

      {currentAnalysis && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <p className="text-sm opacity-80">总人数</p>
              <p className="text-3xl font-bold mt-1">{currentAnalysis.totalUsers}</p>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <p className="text-sm opacity-80">达标人数</p>
              <p className="text-3xl font-bold mt-1">{currentAnalysis.qualifiedUsers}</p>
            </div>
            <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <p className="text-sm opacity-80">未达标人数</p>
              <p className="text-3xl font-bold mt-1">{currentAnalysis.unqualifiedUsers}</p>
            </div>
            <div className="card bg-gradient-to-br from-slate-500 to-slate-600 text-white">
              <p className="text-sm opacity-80">未开机人数</p>
              <p className="text-3xl font-bold mt-1">{currentAnalysis.notStartedUsers}</p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">详细数据列表</h3>
              <button
                onClick={handleExportSalary}
                className="btn-primary flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                导出工资表
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">姓名</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">团队</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">30天/22天</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">30天/10天</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">30天/20人</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">打卡次数</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">设备台数</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">应发金额</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryCalculations.map((calc, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-800">{calc.userName}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{calc.team}</td>
                      <td className="py-3 px-4 text-center">
                        {currentAnalysis.records[idx]?.onlineDays30 >= 22 ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircleIcon className="w-4 h-4" />
                            {currentAnalysis.records[idx]?.onlineDays30}
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {currentAnalysis.records[idx]?.onlineDays30 || 0}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {currentAnalysis.records[idx]?.onlineDays10 >= 10 ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircleIcon className="w-4 h-4" />
                            {currentAnalysis.records[idx]?.onlineDays10}
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {currentAnalysis.records[idx]?.onlineDays10 || 0}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {currentAnalysis.records[idx]?.onlinePersons20 >= 20 ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircleIcon className="w-4 h-4" />
                            {currentAnalysis.records[idx]?.onlinePersons20}
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {currentAnalysis.records[idx]?.onlinePersons20 || 0}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {(currentAnalysis.records[idx]?.checkInCount || 0) >= 12 || 
                         (currentAnalysis.records[idx]?.checkInCount || 0) >= 4 ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircleIcon className="w-4 h-4" />
                            {currentAnalysis.records[idx]?.checkInCount}
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {currentAnalysis.records[idx]?.checkInCount || 0}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">{calc.deviceCount}</td>
                      <td className="py-3 px-4 text-center">
                        {calc.status === 'qualified' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircleIcon className="w-3 h-3" />
                            达标
                          </span>
                        ) : calc.status === 'unqualified' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            <XCircleIcon className="w-3 h-3" />
                            未达标
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                            <ClockIcon className="w-3 h-3" />
                            未开机
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">
                        ¥{calc.grossSalary.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {history.length > 0 && !currentAnalysis && (
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">历史分析记录</h3>
          <div className="grid grid-cols-3 gap-4">
            {history.slice(-3).reverse().map((h, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">分析日期: {h.analysisDate}</p>
                <p className="text-sm text-slate-600">期间: {h.period}</p>
                <p className="text-sm text-slate-600">总人数: {h.totalUsers}</p>
                <p className="text-sm text-green-600">达标: {h.qualifiedUsers}</p>
                <p className="text-sm text-amber-600">未达标: {h.unqualifiedUsers}</p>
                <p className="text-sm text-slate-500">达标率: {h.qualificationRate.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
