import { ApplyStatuses, InfoAccessMethods, MuseumLevels, MuseumNatures, MuseumTypes } from '../types/museum';
import type { MuseumCategory } from '../types/museum';

interface Props {
  category: MuseumCategory;
  filters: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}

const selectCls = 'rounded border border-slate-200 px-2 py-1 text-sm';
const inputCls = 'rounded border border-slate-200 px-2 py-1 text-sm';

export default function MuseumFilters({ category, filters, onChange }: Props) {
  const set = (k: string, v: any) => onChange({ ...filters, [k]: v });
  return (
    <div className="panel">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <input className={inputCls} placeholder="博物馆名称" value={filters.name || ''} onChange={(e) => set('name', e.target.value)} />
        <select className={selectCls} value={filters.level || ''} onChange={(e) => set('level', e.target.value)}>
          <option value="">全部等级</option>{MuseumLevels.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className={selectCls} value={filters.nature || ''} onChange={(e) => set('nature', e.target.value)}>
          <option value="">全部性质</option>{MuseumNatures.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <input className={inputCls} placeholder="省份" value={filters.province || ''} onChange={(e) => set('province', e.target.value)} />
        <select className={selectCls} value={filters.isFreeOpen || ''} onChange={(e) => set('isFreeOpen', e.target.value)}>
          <option value="">是否免费开放</option><option value="是">是</option><option value="否">否</option><option value="部分">部分</option>
        </select>

        {category === '国家一级博物馆' && <select className={selectCls} value={String(filters.hasOfficialWebsite ?? '')} onChange={(e) => set('hasOfficialWebsite', e.target.value === '' ? '' : e.target.value === 'true')}><option value="">是否有官网</option><option value="true">是</option><option value="false">否</option></select>}

        {category === '国家级博物馆' && <>
          <select className={selectCls} value={filters.museumType || ''} onChange={(e) => set('museumType', e.target.value)}><option value="">博物馆类型</option>{MuseumTypes.map((v) => <option key={v} value={v}>{v}</option>)}</select>
          <input className={inputCls} placeholder="城市" value={filters.city || ''} onChange={(e) => set('city', e.target.value)} />
          <select className={selectCls} value={String(filters.hasDigitalCollection ?? '')} onChange={(e) => set('hasDigitalCollection', e.target.value === '' ? '' : e.target.value === 'true')}><option value="">是否有数字藏品</option><option value="true">是</option><option value="false">否</option></select>
          <select className={selectCls} value={filters.infoAccessMethod || ''} onChange={(e) => set('infoAccessMethod', e.target.value)}><option value="">信息获取方式</option>{InfoAccessMethods.map((v) => <option key={v} value={v}>{v}</option>)}</select>
          <select className={selectCls} value={filters.applyRequired || ''} onChange={(e) => set('applyRequired', e.target.value)}><option value="">是否需要申请</option>{ApplyStatuses.map((v) => <option key={v} value={v}>{v}</option>)}</select>
        </>}
      </div>
    </div>
  );
}
