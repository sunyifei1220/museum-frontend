import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MuseumFilters from '../components/MuseumFilters';
import MuseumListView from '../components/MuseumListView';
import Pagination from '../components/Pagination';
import { useMuseumsByCategory } from '../hooks/useMuseums';
import { useMuseumStore } from '../store/museumStore';
import type { MuseumCategory } from '../types/museum';

const tabs: MuseumCategory[] = ['全国博物馆', '国家一级博物馆', '国家级博物馆'];

export default function MuseumListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category, setCategory, initData, loaded } = useMuseumStore();
  useEffect(() => {
    void initData();
  }, [initData]);

  const initial = searchParams.get('category') as MuseumCategory;
  const current = tabs.includes(initial) ? initial : category;
  if (current !== category) setCategory(current);

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const raw = useMuseumsByCategory(current);

  const filtered = useMemo(() => raw.filter((m: any) => {
    if (filters.name && !m.name.includes(filters.name)) return false;
    if (filters.level && m.level !== filters.level) return false;
    if (filters.nature && m.nature !== filters.nature) return false;
    if (filters.province && !m.province.includes(filters.province)) return false;
    if (filters.isFreeOpen && m.isFreeOpen !== filters.isFreeOpen) return false;
    if (current === '国家一级博物馆' && filters.hasOfficialWebsite !== '' && filters.hasOfficialWebsite !== undefined) { if (Boolean(m.officialWebsite) !== filters.hasOfficialWebsite) return false; }
    if (current === '国家级博物馆') {
      if (filters.museumType && m.museumType !== filters.museumType) return false;
      if (filters.city && !m.city.includes(filters.city)) return false;
      if (filters.hasDigitalCollection !== '' && filters.hasDigitalCollection !== undefined) { if (Boolean(m.digitalCollectionLink) !== filters.hasDigitalCollection) return false; }
      if (filters.infoAccessMethod && m.infoAccessMethod !== filters.infoAccessMethod) return false;
      if (filters.applyRequired && m.applyRequired !== filters.applyRequired) return false;
    }
    return true;
  }), [raw, filters, current]);

  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
  if (!loaded) return <div className="panel">数据加载中...</div>;

  return (
    <div className="space-y-4">
      <div className="panel flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} className={`rounded px-3 py-1.5 text-sm ${current === tab ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => { setCategory(tab); setSearchParams({ category: tab }); setFilters({}); setPage(1); }}>
              {tab}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500">博物馆列表工作台</p>
      </div>

      <MuseumFilters category={current} filters={filters} onChange={(next) => { setFilters(next); setPage(1); }} />
      <MuseumListView category={current} data={pageData as any} />
      <Pagination page={page} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
