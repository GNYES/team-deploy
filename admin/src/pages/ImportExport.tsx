import { useState, useRef } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { DocumentArrowUpIcon, DocumentArrowDownIcon, CheckCircleIcon, XCircleIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

type ImportType = 'users' | 'teams' | 'records';

export default function ImportExport() {
  const users = useAdminStore((s) => s.users);
  const teams = useAdminStore((s) => s.teams);
  const deployRecords = useAdminStore((s) => s.deployRecords);
  const salaryConfig = useAdminStore((s) => s.salaryConfig);
  const importUsers = useAdminStore((s) => s.importUsers);
  const importTeams = useAdminStore((s) => s.importTeams);
  const importDeployRecords = useAdminStore((s) => s.importDeployRecords);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<ImportType>('users');
  const [importResult, setImportResult] = useState<{ success: boolean; count: number; message: string } | null>(null);

  const handleExport = (type: 'users' | 'teams' | 'records' | 'salary') => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = users.map((u) => ({
          姓名: u.name,
          手机号: u.phone,
          团队: u.team,
          角色: u.role === 'leader' ? '组长' : u.role === 'admin' ? '管理员' : '成员',
          铺设设备: u.devices,
          蓝环数: u.rings,
          创建日期: u.createdAt,
        }));
        filename = '用户数据';
        break;
      case 'teams':
        data = teams.map((t) => ({
          团队名称: t.name,
          队长: t.leader,
          区域: t.region,
          成员数: t.members,
          铺设设备: t.devices,
          蓝环数: t.rings,
        }));
        filename = '团队数据';
        break;
      case 'records':
        data = deployRecords.map((r) => ({
          日期: r.date,
          成员姓名: r.userName,
          团队: r.team,
          地点: r.location,
          铺设设备: r.devices,
          蓝环数: r.rings,
          备注: r.note || '',
        }));
        filename = '铺设记录';
        break;
      case 'salary':
        data = [{
          配置名称: salaryConfig.name,
          基础工资: salaryConfig.baseSalary,
          设备单价: salaryConfig.devicePrice,
          蓝环单价: salaryConfig.ringPrice,
          蓝环提成比例: salaryConfig.ringCommissionRate,
          第一阶段目标: salaryConfig.target,
          第一阶段奖金: salaryConfig.targetBonus,
          第二阶段目标: salaryConfig.bonusTarget,
          第二阶段奖金: salaryConfig.bonusAmount,
          更新时间: salaryConfig.updatedAt,
        }];
        filename = '工资配置';
        break;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '数据');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setImportResult({ success: true, count: data.length, message: `成功导出 ${data.length} 条数据到 ${filename}.xlsx` });
    setTimeout(() => setImportResult(null), 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        let importedCount = 0;
        
        switch (importType) {
          case 'users':
            const usersData = jsonData.map((row: any) => ({
              name: row.姓名 || row.name || '',
              phone: row.手机号 || row.phone || '',
              team: row.团队 || row.team || '默认团队',
              role: (row.角色 === '组长' ? 'leader' : row.角色 === '管理员' ? 'admin' : 'member') as 'member' | 'leader' | 'admin',
              devices: Number(row.铺设设备 || row.devices || 0),
              rings: Number(row.蓝环数 || row.rings || 0),
              createdAt: row.创建日期 || row.createdAt || new Date().toISOString().split('T')[0],
            }));
            importUsers(usersData);
            importedCount = usersData.length;
            break;
          case 'teams':
            const teamsData = jsonData.map((row: any) => ({
              name: row.团队名称 || row.name || '',
              leader: row.队长 || row.leader || '',
              region: row.区域 || row.region || '未知',
              members: Number(row.成员数 || row.members || 0),
              devices: Number(row.铺设设备 || row.devices || 0),
              rings: Number(row.蓝环数 || row.rings || 0),
            }));
            importTeams(teamsData);
            importedCount = teamsData.length;
            break;
          case 'records':
            const recordsData = jsonData.map((row: any) => ({
              userId: '',
              userName: row.成员姓名 || row.userName || '未知',
              team: row.团队 || row.team || '默认团队',
              date: row.日期 || row.date || new Date().toISOString().split('T')[0],
              devices: Number(row.铺设设备 || row.devices || 0),
              rings: Number(row.蓝环数 || row.rings || 0),
              location: row.地点 || row.location || '未指定',
              note: row.备注 || row.note,
            }));
            importDeployRecords(recordsData);
            importedCount = recordsData.length;
            break;
        }

        setImportResult({ success: true, count: importedCount, message: `成功导入 ${importedCount} 条数据` });
      } catch (error) {
        setImportResult({ success: false, count: 0, message: '导入失败：文件格式错误' });
      }
    };
    reader.readAsArrayBuffer(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const templateData: Record<ImportType, { headers: string[]; sample: any[] }> = {
    users: {
      headers: ['姓名', '手机号', '团队', '角色', '铺设设备', '蓝环数', '创建日期'],
      sample: [
        { 姓名: '张三', 手机号: '13800138001', 团队: '华东战队', 角色: '成员', 铺设设备: 0, 蓝环数: 0, 创建日期: '2024-01-15' },
        { 姓名: '李四', 手机号: '13800138002', 团队: '华南战队', 角色: '组长', 铺设设备: 0, 蓝环数: 0, 创建日期: '2024-01-15' },
      ],
    },
    teams: {
      headers: ['团队名称', '队长', '区域', '成员数', '铺设设备', '蓝环数'],
      sample: [
        { 团队名称: '华东战队', 队长: '王建国', 区域: '华东', 成员数: 5, 铺设设备: 0, 蓝环数: 0 },
        { 团队名称: '华南战队', 队长: '李明辉', 区域: '华南', 成员数: 4, 铺设设备: 0, 蓝环数: 0 },
      ],
    },
    records: {
      headers: ['日期', '成员姓名', '团队', '地点', '铺设设备', '蓝环数', '备注'],
      sample: [
        { 日期: '2024-01-15', 成员姓名: '张三', 团队: '华东战队', 地点: '上海市', 铺设设备: 5, 蓝环数: 3, 备注: '' },
        { 日期: '2024-01-15', 成员姓名: '李四', 团队: '华南战队', 地点: '广州市', 铺设设备: 4, 蓝环数: 2, 备注: '' },
      ],
    },
  };

  const handleDownloadTemplate = (type: ImportType) => {
    const { headers, sample } = templateData[type];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '模板');
    const name = type === 'users' ? '用户' : type === 'teams' ? '团队' : '铺设记录';
    XLSX.writeFile(wb, `${name}_导入模板.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">导入导出</h1>
        <p className="text-slate-500 mt-1">批量导入和导出数据</p>
      </div>

      {importResult && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          importResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {importResult.success ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <XCircleIcon className="w-5 h-5" />
          )}
          <span>{importResult.message}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DocumentArrowUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">导入数据</h3>
              <p className="text-sm text-slate-500">从Excel文件导入数据</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">选择导入类型</label>
              <div className="flex gap-3">
                {(['users', 'teams', 'records'] as ImportType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setImportType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      importType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'users' ? '用户' : type === 'teams' ? '团队' : '铺设记录'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">选择Excel文件</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <DocumentArrowUpIcon className="w-5 h-5" />
                选择文件上传
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">下载导入模板</span>
                <button
                  onClick={() => handleDownloadTemplate(importType)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  点击下载
                </button>
              </div>
              <p className="text-xs text-slate-500">
                模板字段: {templateData[importType].headers.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DocumentArrowDownIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">导出数据</h3>
              <p className="text-sm text-slate-500">导出数据为Excel文件</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleExport('users')}
              className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left"
            >
              <TableCellsIcon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-slate-800">用户数据</p>
              <p className="text-sm text-slate-500">{users.length} 条记录</p>
            </button>

            <button
              onClick={() => handleExport('teams')}
              className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left"
            >
              <TableCellsIcon className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-slate-800">团队数据</p>
              <p className="text-sm text-slate-500">{teams.length} 条记录</p>
            </button>

            <button
              onClick={() => handleExport('records')}
              className="p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors text-left"
            >
              <TableCellsIcon className="w-6 h-6 text-cyan-600 mb-2" />
              <p className="font-medium text-slate-800">铺设记录</p>
              <p className="text-sm text-slate-500">{deployRecords.length} 条记录</p>
            </button>

            <button
              onClick={() => handleExport('salary')}
              className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors text-left"
            >
              <TableCellsIcon className="w-6 h-6 text-amber-600 mb-2" />
              <p className="font-medium text-slate-800">工资配置</p>
              <p className="text-sm text-slate-500">当前配置</p>
            </button>
          </div>

          <button
            onClick={() => {
              handleExport('users');
              handleExport('teams');
              handleExport('records');
            }}
            className="btn-primary w-full mt-4"
          >
            导出全部数据
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">数据统计</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            <p className="text-sm text-slate-500">用户总数</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-purple-600">{teams.length}</p>
            <p className="text-sm text-slate-500">团队总数</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-cyan-600">{deployRecords.length}</p>
            <p className="text-sm text-slate-500">铺设记录</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {users.reduce((acc, u) => acc + u.devices, 0)}
            </p>
            <p className="text-sm text-slate-500">设备总数</p>
          </div>
        </div>
      </div>
    </div>
  );
}
