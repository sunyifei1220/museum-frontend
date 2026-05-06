import ReactECharts from 'echarts-for-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import StatCard from '../components/StatCard';
import { useMuseumStore } from '../store/museumStore';
import { formatNumber } from '../utils/format';

export default function HomePage() {
  const { allMuseums, firstClassMuseums, nationalMuseums, initData, loaded } = useMuseumStore();
  useEffect(() => { void initData(); }, [initData]);
  if (!loaded) return <div className="panel">数据加载中...</div>;

  const all = [...allMuseums, ...firstClassMuseums, ...nationalMuseums];
  const metrics = { total: allMuseums.length, rated: all.filter((m) => m.level !== '未定级').length, first: firstClassMuseums.length, national: nationalMuseums.length, free: all.filter((m) => m.isFreeOpen === '是').length };
  const byLevel = all.reduce<Record<string, number>>((acc, m) => ((acc[m.level] = (acc[m.level] || 0) + 1), acc), {});
  const byProvince = all.reduce<Record<string, number>>((acc, m) => ((acc[m.province] = (acc[m.province] || 0) + 1), acc), {});
  const totals = all.reduce((acc, m) => ({ collections: acc.collections + m.collectionsCount, exhibitions: acc.exhibitions + m.exhibitionsCount, education: acc.education + m.educationActivitiesCount }), { collections: 0, exhibitions: 0, education: 0 });

  return <div className="space-y-6"><section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"><StatCard title="全国博物馆总数" value={metrics.total} /><StatCard title="已定级馆总数" value={metrics.rated} /><StatCard title="一级馆数量" value={metrics.first} /><StatCard title="国家级馆数量" value={metrics.national} /><StatCard title="免费开放馆数量" value={metrics.free} /></section><section className="grid grid-cols-1 gap-4 lg:grid-cols-3"><div className="panel lg:col-span-1"><ReactECharts style={{ height: 320 }} option={{ tooltip: {}, title: { text: '等级分布', left: 'center', textStyle: { fontSize: 14 } }, xAxis: { type: 'category', data: Object.keys(byLevel) }, yAxis: { type: 'value' }, series: [{ type: 'bar', data: Object.values(byLevel), itemStyle: { color: '#2b5cff' } }] }} /></div><div className="panel lg:col-span-2"><ReactECharts style={{ height: 320 }} option={{ tooltip: {}, title: { text: '各省博物馆数量分布', left: 'center', textStyle: { fontSize: 14 } }, xAxis: { type: 'category', data: Object.keys(byProvince) }, yAxis: { type: 'value' }, series: [{ type: 'bar', data: Object.values(byProvince), itemStyle: { color: '#0f766e' } }] }} /></div></section><section className="panel"><ReactECharts style={{ height: 300 }} option={{ tooltip: {}, legend: { data: ['藏品数量', '展览数量', '教育活动数量'] }, xAxis: { type: 'category', data: ['总览'] }, yAxis: { type: 'value' }, series: [{ name: '藏品数量', type: 'bar', data: [totals.collections] }, { name: '展览数量', type: 'bar', data: [totals.exhibitions] }, { name: '教育活动数量', type: 'bar', data: [totals.education] }] }} /></section><section className="grid grid-cols-1 gap-4 md:grid-cols-2"><Link to="/museums?category=国家一级博物馆" className="panel hover:bg-brand-50">国家一级博物馆入口</Link><Link to="/museums?category=国家级博物馆" className="panel hover:bg-brand-50">国家级博物馆入口</Link></section><section className="panel"><h2 className="text-base font-semibold">重点馆推荐</h2><div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">{nationalMuseums.slice(0, 3).map((m) => <Link key={m.id} className="rounded-lg border border-slate-200 p-3 hover:border-brand-500" to={`/museums/${m.id}`}><p className="font-medium">{m.name}</p><p className="text-xs text-slate-500 mt-1">{m.province} {m.city} · {m.museumType}</p><p className="text-xs text-slate-500 mt-1">年接待 {formatNumber(m.annualVisitors)}</p></Link>)}</div></section></div>;
}
