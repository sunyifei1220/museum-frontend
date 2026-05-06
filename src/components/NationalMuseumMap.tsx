import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { NationalMuseum } from '../types/museum';

interface Props {
  data: NationalMuseum[];
  selectedId?: string;
  onSelect: (museum: NationalMuseum) => void;
}

const normalizeProvince = (name: string) =>
  (name || '')
    .replace(/特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|省|市/g, '')
    .trim();

export default function NationalMuseumMap({ data, selectedId, onSelect }: Props) {
  const [ready, setReady] = useState(false);
  const [activeProvince, setActiveProvince] = useState<string>('');
  const [geoCenter, setGeoCenter] = useState<[number, number] | undefined>(undefined);
  const [geoZoom, setGeoZoom] = useState(1.1);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    const register = async () => {
      const geoJson = await fetch('/data/china.geojson').then((r) => r.json());
      echarts.registerMap('china', geoJson as any);
      if (mounted) setReady(true);
    };
    void register();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    if (!activeProvince) return data;
    return data.filter((m) => normalizeProvince(m.province) === normalizeProvince(activeProvince));
  }, [data, activeProvince]);

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const m = params.data?.museum as NationalMuseum | undefined;
          if (!m) return params.name || '';
          return `${m.name}<br/>${m.province} ${m.city}<br/>${m.museumType}`;
        },
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: geoZoom,
        center: geoCenter,
        label: { show: false },
        itemStyle: { areaColor: '#0f172a', borderColor: '#334155' },
        emphasis: { itemStyle: { areaColor: '#1e293b' } },
      },
      series: [
        {
          name: '国家级博物馆',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: filteredData.map((m) => ({
            name: m.name,
            value: [m.coordinates.lng, m.coordinates.lat],
            museum: m,
            symbolSize: selectedId === m.id ? 18 : 12,
            itemStyle: { color: selectedId === m.id ? '#22d3ee' : '#38bdf8' },
          })),
          emphasis: { scale: true },
        },
      ],
    }),
    [filteredData, selectedId, geoCenter, geoZoom],
  );

  const drillProvince = (provinceName: string) => {
    const p = normalizeProvince(provinceName);
    const points = data.filter((m) => normalizeProvince(m.province) === p);
    if (points.length === 0) return;
    const centerLng = points.reduce((s, m) => s + m.coordinates.lng, 0) / points.length;
    const centerLat = points.reduce((s, m) => s + m.coordinates.lat, 0) / points.length;
    setActiveProvince(provinceName);
    setGeoCenter([centerLng, centerLat]);
    setGeoZoom(4);
    onSelect(points[0]);
  };

  const resetView = () => {
    setActiveProvince('');
    setGeoCenter(undefined);
    setGeoZoom(1.1);
  };

  return (
    <div className="panel">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">国家级博物馆地图（中国完整地图）</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {activeProvince ? `当前省份：${activeProvince}` : '全国视图'} · 点位：{filteredData.length}
          </span>
          <button
            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
            onClick={resetView}
          >
            重置
          </button>
        </div>
      </div>

      {ready ? (
        <ReactECharts
          ref={chartRef}
          style={{ height: 520 }}
          option={option}
          onEvents={{
            click: (params: any) => {
              if (params?.componentType === 'series') {
                const m = params?.data?.museum as NationalMuseum | undefined;
                if (m) onSelect(m);
                return;
              }
              if (params?.componentType === 'geo' && params?.name) {
                drillProvince(params.name);
              }
            },
          }}
        />
      ) : (
        <div className="flex h-[520px] items-center justify-center rounded border border-slate-200 text-sm text-slate-500">地图加载中...</div>
      )}
    </div>
  );
}
