import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import StatCard from '../components/StatCard';
import { useMuseumStore } from '../store/museumStore';

const provinceNameMap: Record<string, string> = {
  北京: '北京市',
  天津: '天津市',
  上海: '上海市',
  重庆: '重庆市',
  河北: '河北省',
  山西: '山西省',
  辽宁: '辽宁省',
  吉林: '吉林省',
  黑龙江: '黑龙江省',
  江苏: '江苏省',
  浙江: '浙江省',
  安徽: '安徽省',
  福建: '福建省',
  江西: '江西省',
  山东: '山东省',
  河南: '河南省',
  湖北: '湖北省',
  湖南: '湖南省',
  广东: '广东省',
  海南: '海南省',
  四川: '四川省',
  贵州: '贵州省',
  云南: '云南省',
  陕西: '陕西省',
  甘肃: '甘肃省',
  青海: '青海省',
  台湾: '台湾省',
  内蒙古: '内蒙古自治区',
  广西: '广西壮族自治区',
  西藏: '西藏自治区',
  宁夏: '宁夏回族自治区',
  新疆: '新疆维吾尔自治区',
  香港: '香港特别行政区',
  澳门: '澳门特别行政区',
};

const reverseProvinceMap = Object.entries(provinceNameMap).reduce<Record<string, string>>((acc, [short, full]) => {
  acc[full] = short;
  return acc;
}, {});

export default function HomePage() {
  const { allMuseums, firstClassMuseums, nationalMuseums, initData, loaded } = useMuseumStore();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    void initData();
  }, [initData]);

  useEffect(() => {
    let mounted = true;
    const register = async () => {
      const geoJson = await fetch('/data/china.geojson').then((r) => r.json());
      echarts.registerMap('china', geoJson as any);
      if (mounted) setMapReady(true);
    };
    void register();
    return () => {
      mounted = false;
    };
  }, []);

  if (!loaded) return <div className="panel">数据加载中...</div>;

  const all = [...allMuseums, ...firstClassMuseums, ...nationalMuseums];
  const metrics = {
    total: allMuseums.length,
    rated: allMuseums.filter((m) => m.level !== '未定级').length,
    first: allMuseums.filter((m) => m.level === '国家一级博物馆').length,
    free: all.filter((m) => m.isFreeOpen === '是').length,
  };

  const levelData = Object.entries(allMuseums.reduce<Record<string, number>>((acc, m) => ((acc[m.level] = (acc[m.level] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));
  const natureData = Object.entries(allMuseums.reduce<Record<string, number>>((acc, m) => ((acc[m.nature] = (acc[m.nature] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));

  const provinceAgg = allMuseums.reduce<Record<string, { total: number; l1: number; l2: number; l3: number }>>((acc, m) => {
    if (!acc[m.province]) acc[m.province] = { total: 0, l1: 0, l2: 0, l3: 0 };
    acc[m.province].total += 1;
    if (m.level === '国家一级博物馆') acc[m.province].l1 += 1;
    if (m.level === '国家二级博物馆') acc[m.province].l2 += 1;
    if (m.level === '国家三级博物馆') acc[m.province].l3 += 1;
    return acc;
  }, {});

  const mapData = Object.entries(provinceAgg).map(([shortName, stat]) => ({
    name: provinceNameMap[shortName] || shortName,
    value: stat.total,
  }));

  const maxValue = Math.max(...Object.values(provinceAgg).map((x) => x.total), 1);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="全国博物馆总数" value={metrics.total} />
        <StatCard title="已定级馆总数" value={metrics.rated} />
        <StatCard title="一级馆数量" value={metrics.first} />
        <StatCard title="免费开放馆数量" value={metrics.free} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel">
          <ReactECharts style={{ height: 300 }} option={{ title: { text: '等级占比（名录口径）', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: ['42%', '68%'], data: levelData }] }} />
        </div>
        <div className="panel">
          <ReactECharts style={{ height: 300 }} option={{ title: { text: '性质分布（名录口径）', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: ['42%', '68%'], data: natureData }] }} />
        </div>
      </section>

      <section className="panel">
        {mapReady ? (
          <ReactECharts
            style={{ height: 520 }}
            option={{
              title: { text: '中国地图省份热力（全国名录口径）', left: 'center', textStyle: { fontSize: 14 } },
              tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                  const fullName = params.name || '';
                  const shortName = reverseProvinceMap[fullName] || fullName.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区/g, '');
                  const stat = provinceAgg[fullName] || provinceAgg[shortName];
                  if (!stat) return `${fullName}<br/>总数：0`;
                  return `${fullName}<br/>总数：${stat.total}<br/>一级：${stat.l1}<br/>二级：${stat.l2}<br/>三级：${stat.l3}`;
                },
              },
              visualMap: {
                min: 0,
                max: maxValue,
                left: 24,
                bottom: 20,
                text: ['高', '低'],
                inRange: { color: ['#dbeafe', '#2563eb'] },
                calculable: true,
              },
              series: [
                {
                  type: 'map',
                  map: 'china',
                  roam: true,
                  label: { show: false },
                  data: mapData,
                  itemStyle: { borderColor: '#cbd5e1', borderWidth: 0.8 },
                  emphasis: { label: { show: false }, itemStyle: { areaColor: '#60a5fa' } },
                },
              ],
            }}
          />
        ) : (
          <div className="flex h-[520px] items-center justify-center text-sm text-slate-500">地图加载中...</div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/museums?category=国家一级博物馆" className="panel hover:bg-brand-50">进入国家一级博物馆列表</Link>
        <Link to="/museums?category=国家级博物馆" className="panel hover:bg-brand-50">进入国家级博物馆列表</Link>
      </section>
    </div>
  );
}
