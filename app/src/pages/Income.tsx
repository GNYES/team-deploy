import { useUserStore, useDeployStore, useSalaryStore } from '@/stores';
import { CurrencyDollarIcon, DevicePhoneMobileIcon, MapPinIcon, GiftIcon, CalculatorIcon } from '@heroicons/react/24/outline';

export default function Income() {
  const user = useUserStore((s) => s.user);
  const records = useDeployStore((s) => s.records);
  const config = useSalaryStore((s) => s.config);
  const calculateIncome = useSalaryStore((s) => s.calculateIncome);

  const userRecords = records.filter((r) => r.userId === user?.id);
  const totalDevices = userRecords.reduce((acc, r) => acc + r.devices, 0);
  const totalRings = userRecords.reduce((acc, r) => acc + r.rings, 0);

  const income = calculateIncome(totalDevices, totalRings);

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-100 text-sm mb-1">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span>预估月收入</span>
          </div>
          <p className="text-4xl font-bold mb-1">¥{income.netIncome.toFixed(2)}</p>
          <p className="text-emerald-200 text-sm">税后收入</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card">
          <p className="text-xs text-slate-500 mb-1">基础工资</p>
          <p className="text-xl font-bold text-slate-800">¥{income.baseSalary.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 mb-1">应发工资</p>
          <p className="text-xl font-bold text-slate-800">¥{income.grossIncome.toFixed(2)}</p>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CalculatorIcon className="w-5 h-5 text-blue-600" />
          收入明细
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">设备铺设佣金</p>
                <p className="text-xs text-slate-500">{totalDevices}台 × ¥{config.devicePrice} × 阶梯费率</p>
              </div>
            </div>
            <p className="font-semibold text-blue-600">+¥{income.deviceCommission.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">小蓝环佣金</p>
                <p className="text-xs text-slate-500">{totalRings}个 × ¥{config.ringPrice} × {config.ringCommissionRate * 100}%</p>
              </div>
            </div>
            <p className="font-semibold text-cyan-600">+¥{income.ringCommission.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <GiftIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">目标奖金</p>
                <p className="text-xs text-slate-500">
                  {totalDevices >= config.bonusTarget ? `达标(${config.bonusTarget}台)` : `${config.target}-${config.bonusTarget}台`}
                </p>
              </div>
            </div>
            <p className="font-semibold text-amber-600">+¥{income.bonus.toFixed(2)}</p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
              <span>税前合计</span>
              <span>¥{income.grossIncome.toFixed(2)}</span>
            </div>
            {income.tax > 0 && (
              <div className="flex items-center justify-between text-sm text-red-500 mb-2">
                <span>个人所得税</span>
                <span>-¥{income.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-lg font-bold text-slate-800">
              <span>税后收入</span>
              <span className="text-emerald-600">¥{income.netIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">📊 佣金规则</h3>
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">• 设备铺设：阶梯式佣金比例</p>
          {config.deviceCommissionRates.map((tier, idx) => (
            <p key={idx} className="text-slate-500 pl-4">
              {tier.min}-{tier.max === Infinity ? '∞' : tier.max}台：{(tier.rate * 100).toFixed(0)}%提成
            </p>
          ))}
          <p className="text-slate-600 mt-2">• 小蓝环：固定{config.ringCommissionRate * 100}%佣金</p>
          <p className="text-slate-600">• 完成目标({config.target}台)：+¥{config.targetBonus}</p>
          <p className="text-slate-600">• 高额目标({config.bonusTarget}台)：+¥{config.bonusAmount}</p>
        </div>
      </div>
    </div>
  );
}
