import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { CalculatorIcon, DevicePhoneMobileIcon, MapPinIcon, GiftIcon, CheckIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export default function Salary() {
  const config = useAdminStore((s) => s.salaryConfig);
  const updateConfig = useAdminStore((s) => s.updateSalaryConfig);
  const calculateIncome = useAdminStore((s) => s.calculateIncome);

  const [formData, setFormData] = useState({
    name: config.name,
    baseSalary: config.baseSalary,
    devicePrice: config.devicePrice,
    ringPrice: config.ringPrice,
    ringCommissionRate: config.ringCommissionRate,
    target: config.target,
    bonusTarget: config.bonusTarget,
    bonusAmount: config.bonusAmount,
    targetBonus: config.targetBonus,
  });

  const [previewDevices, setPreviewDevices] = useState(30);
  const [previewRings, setPreviewRings] = useState(15);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const preview = calculateIncome(previewDevices, previewRings);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">工资配置</h1>
          <p className="text-slate-500 mt-1">设置薪资结构和提成规则</p>
        </div>
        <button
          onClick={handleSave}
          className={`btn-primary flex items-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          <DocumentCheckIcon className="w-5 h-5" />
          {saved ? '已保存' : '保存配置'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4">基础配置</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">配置名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">基础工资 (元)</label>
                <input
                  type="number"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">设备单价 (元/台)</label>
                <input
                  type="number"
                  value={formData.devicePrice}
                  onChange={(e) => setFormData({ ...formData, devicePrice: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">蓝环单价 (元/个)</label>
                <input
                  type="number"
                  value={formData.ringPrice}
                  onChange={(e) => setFormData({ ...formData, ringPrice: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">蓝环提成比例</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ringCommissionRate}
                  onChange={(e) => setFormData({ ...formData, ringCommissionRate: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">第一阶段目标 (台)</label>
                <input
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">第二阶段目标 (台)</label>
                <input
                  type="number"
                  value={formData.bonusTarget}
                  onChange={(e) => setFormData({ ...formData, bonusTarget: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">第一阶段奖金 (元)</label>
                <input
                  type="number"
                  value={formData.targetBonus}
                  onChange={(e) => setFormData({ ...formData, targetBonus: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">第二阶段奖金 (元)</label>
                <input
                  type="number"
                  value={formData.bonusAmount}
                  onChange={(e) => setFormData({ ...formData, bonusAmount: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4">设备阶梯提成配置</h3>
            <div className="space-y-4">
              {config.deviceCommissionRates.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">最低数量</label>
                    <input
                      type="number"
                      value={tier.min}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div className="flex items-center text-slate-400">-</div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">最高数量</label>
                    <input
                      type="number"
                      value={tier.max === Infinity ? '∞' : tier.max}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">提成比例</label>
                    <input
                      type="number"
                      step="0.01"
                      value={(tier.rate * 100).toFixed(0)}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div className="text-slate-500 text-sm">%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CalculatorIcon className="w-5 h-5" />
              收入预览
            </h3>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-xs text-emerald-200 mb-1">铺设设备数</label>
                <input
                  type="number"
                  value={previewDevices}
                  onChange={(e) => setPreviewDevices(Number(e.target.value))}
                  className="w-full bg-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-emerald-200 mb-1">铺设蓝环数</label>
                <input
                  type="number"
                  value={previewRings}
                  onChange={(e) => setPreviewRings(Number(e.target.value))}
                  className="w-full bg-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200 outline-none"
                />
              </div>
            </div>

            <div className="border-t border-white/20 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-200">基础工资</span>
                <span>¥{preview.baseSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-200">设备佣金</span>
                <span className="text-blue-200">+¥{preview.deviceCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-200">蓝环佣金</span>
                <span className="text-cyan-200">+¥{preview.ringCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-200">目标奖金</span>
                <span className="text-amber-200">+¥{preview.bonus.toFixed(2)}</span>
              </div>
              {preview.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-200">个人所得税</span>
                  <span className="text-red-200">-¥{preview.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/20">
                <span>税后收入</span>
                <span>¥{preview.netIncome.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4">当前配置</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600">• 基础工资: ¥{config.baseSalary}</p>
              <p className="text-slate-600">• 设备单价: ¥{config.devicePrice}/台</p>
              <p className="text-slate-600">• 蓝环单价: ¥{config.ringPrice}/个</p>
              <p className="text-slate-600">• 蓝环提成: {config.ringCommissionRate * 100}%</p>
              <p className="text-slate-600">• 第一阶段: {config.target}台 +¥{config.targetBonus}</p>
              <p className="text-slate-600">• 第二阶段: {config.bonusTarget}台 +¥{config.bonusAmount}</p>
              <p className="text-slate-400 text-xs mt-2">最后更新: {new Date(config.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
