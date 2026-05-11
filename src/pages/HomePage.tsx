import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import StatCard from '../components/StatCard';
import { useMuseumStore } from '../store/museumStore';

export default function HomePage() {
  const { allMuseums, firstClassMuseums, nationalMuseums, initData, loaded } = useMuseumStore();
  useEffect(() => {
    void initData();
  }, [initData]);
  if (!loaded) return <div className="panel">数据加载中...</div>;

  const all = [...allMuseums, ...firstClassMuseums, ...nationalMuseums];
  const metrics = {
    total: allMuseums.length,
    rated: all.filter((m) => m.level !== '未定级').length,
    first: allMuseums.filter((m) => m.level === '国家一级博物馆').length,
    national: nationalMuseums.length,
    free: all.filter((m) => m.isFreeOpen === '是').length,
  };

  const levelData = Object.entries(all.reduce<Record<string, number>>((acc, m) => ((acc[m.level] = (acc[m.level] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));
  const natureData = Object.entries(all.reduce<Record<string, number>>((acc, m) => ((acc[m.nature] = (acc[m.nature] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));
  const provinceTop = Object.entries(all.reduce<Record<string, number>>((acc, m) => ((acc[m.province] = (acc[m.province] || 0) + 1), acc), {})).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="space-y-6">
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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/museums?category=国家一级博物馆" className="panel hover:bg-brand-50">进入国家一级博物馆列表</Link>
        <Link to="/museums?category=国家级博物馆" className="panel hover:bg-brand-50">进入国家级博物馆列表</Link>
      </section>
    </div>
  );
}
