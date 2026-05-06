import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import MuseumFilters from '../components/MuseumFilters';
import MuseumListView from '../components/MuseumListView';
import Pagination from '../components/Pagination';
import StatCard from '../components/StatCard';
import { useMuseumsByCategory } from '../hooks/useMuseums';
import { useMuseumStore } from '../store/museumStore';
import type { MuseumCategory } from '../types/museum';

const tabs: MuseumCategory[] = ['全国博物馆', '国家一级博物馆', '国家级博物馆'];

export default function MuseumListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category, setCategory, initData, loaded, allMuseums, firstClassMuseums, nationalMuseums } = useMuseumStore();
  useEffect(() => { void initData(); }, [initData]);

  const initial = searchParams.get('category') as MuseumCategory;
  const current = tabs.includes(initial) ? initial : category;
  if (current !== category) setCategory(current);

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const raw = useMuseumsByCategory(current);

  const all = [...allMuseums, ...firstClassMuseums, ...nationalMuseums];
  const metrics = {
    total: allMuseums.length,
    rated: all.filter((m) => m.level !== '未定级').length,
    first: firstClassMuseums.length,
    national: nationalMuseums.length,
    free: all.filter((m) => m.isFreeOpen === '是').length,
  };

  const levelData = Object.entries(all.reduce<Record<string, number>>((acc, m) => ((acc[m.level] = (acc[m.level] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));
  const natureData = Object.entries(all.reduce<Record<string, number>>((acc, m) => ((acc[m.nature] = (acc[m.nature] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));

  const provinceTop = Object.entries(all.reduce<Record<string, number>>((acc, m) => ((acc[m.province] = (acc[m.province] || 0) + 1), acc), {}))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

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
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="全国博物馆总数" value={metrics.total} />
        <StatCard title="已定级馆总数" value={metrics.rated} />
        <StatCard title="一级馆数量" value={metrics.first} />
        <StatCard title="国家级馆数量" value={metrics.national} />
        <StatCard title="免费开放馆数量" value={metrics.free} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel">
          <ReactECharts style={{ height: 280 }} option={{ title: { text: '等级占比', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: ['42%', '68%'], data: levelData }] }} />
        </div>
        <div className="panel">
          <ReactECharts style={{ height: 280 }} option={{ title: { text: '性质分布', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'item' }, series: [{ type: 'pie', roseType: 'area', radius: ['20%', '70%'], data: natureData }] }} />
        </div>
        <div className="panel">
          <ReactECharts
            style={{ height: 280 }}
            option={{
              title: { text: '省份热力矩阵（Top8）', left: 'center', textStyle: { fontSize: 14 } },
              tooltip: {},
              xAxis: { type: 'category', data: provinceTop.map((x) => x[0]), axisLabel: { rotate: 28 } },
              yAxis: { type: 'category', data: ['博物馆数'] },
              visualMap: { min: 0, max: Math.max(...provinceTop.map((x) => x[1]), 1), show: false, inRange: { color: ['#dbeafe', '#2563eb'] } },
              series: [{ type: 'heatmap', data: provinceTop.map((x, i) => [i, 0, x[1]]), label: { show: true } }],
            }}
          />
        </div>
      </section>

      <div className="panel flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} className={`rounded px-3 py-1.5 text-sm ${current === tab ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => { setCategory(tab); setSearchParams({ category: tab }); setFilters({}); setPage(1); }}>
              {tab}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500">统一总览与列表工作台</p>
      </div>

      <MuseumFilters category={current} filters={filters} onChange={(next) => { setFilters(next); setPage(1); }} />
      <MuseumListView category={current} data={pageData as any} />
      <Pagination page={page} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
