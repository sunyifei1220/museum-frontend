import { useMemo, useState, useEffect } from 'react';
import NationalMuseumMap from '../components/NationalMuseumMap';
import { useMuseumStore } from '../store/museumStore';

export default function NationalMapPage() {
  const { nationalMuseums, initData, loaded } = useMuseumStore();
  useEffect(() => { void initData(); }, [initData]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState<any>(null);

  const list = useMemo(() => nationalMuseums.filter((m) => {
    if (filters.name && !m.name.includes(filters.name)) return false;
    if (filters.museumType && m.museumType !== filters.museumType) return false;
    if (filters.province && !m.province.includes(filters.province)) return false;
    if (filters.city && !m.city.includes(filters.city)) return false;
    if (filters.isFreeOpen && m.isFreeOpen !== filters.isFreeOpen) return false;
    if (filters.hasDigitalCollection !== '' && filters.hasDigitalCollection !== undefined) { if (Boolean(m.digitalCollectionLink) !== filters.hasDigitalCollection) return false; }
    if (filters.infoAccessMethod && m.infoAccessMethod !== filters.infoAccessMethod) return false;
    if (filters.applyRequired && m.applyRequired !== filters.applyRequired) return false;
    return true;
  }), [filters, nationalMuseums]);

  useEffect(() => { if (!selected && nationalMuseums.length > 0) setSelected(nationalMuseums[0]); }, [selected, nationalMuseums]);
  if (!loaded) return <div className="panel">数据加载中...</div>;

  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-12"><aside className="panel lg:col-span-3 space-y-2"><h2 className="font-semibold">筛选</h2><input className="w-full rounded border px-2 py-1 text-sm" placeholder="博物馆名称" onChange={(e) => setFilters((f: any) => ({ ...f, name: e.target.value }))} /><input className="w-full rounded border px-2 py-1 text-sm" placeholder="博物馆类型" onChange={(e) => setFilters((f: any) => ({ ...f, museumType: e.target.value }))} /><input className="w-full rounded border px-2 py-1 text-sm" placeholder="省份" onChange={(e) => setFilters((f: any) => ({ ...f, province: e.target.value }))} /><input className="w-full rounded border px-2 py-1 text-sm" placeholder="城市" onChange={(e) => setFilters((f: any) => ({ ...f, city: e.target.value }))} /></aside><section className="lg:col-span-6"><NationalMuseumMap data={list} selectedId={selected?.id} onSelect={setSelected} /></section><aside className="panel lg:col-span-3"><h2 className="font-semibold">点位详情</h2>{selected && <div className="mt-3 space-y-1 text-sm"><p>博物馆名称：{selected.name}</p><p>等级：{selected.level}</p><p>博物馆性质：{selected.nature}</p><p>博物馆类型：{selected.museumType}</p><p>省份：{selected.province}</p><p>城市：{selected.city}</p><p>详细地址：{selected.address}</p><p>官网：{selected.officialWebsite ? <a className="text-brand-700 hover:underline" href={selected.officialWebsite} target="_blank">访问</a> : '-'}</p><p>数字藏品：{selected.digitalCollectionLink ? <a className="text-brand-700 hover:underline" href={selected.digitalCollectionLink} target="_blank">访问</a> : '-'}</p><p>信息获取方式：{selected.infoAccessMethod}</p><p>是否需要申请：{selected.applyRequired}</p><a className="mt-2 inline-block rounded bg-brand-500 px-3 py-1 text-white hover:bg-brand-700" href={`/museums/${selected.id}`}>查看详情</a></div>}</aside></div>;
}
