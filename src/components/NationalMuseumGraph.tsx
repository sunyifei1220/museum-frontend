import ReactECharts from 'echarts-for-react';
import type { NationalMuseum } from '../types/museum';

type NodeType = 'museum' | 'province' | 'level' | 'type';

interface NodePayload {
  name: string;
  nodeType: NodeType;
}

interface Props {
  museums: NationalMuseum[];
  focusedMuseumName: string | null;
  onNodeClick: (payload: NodePayload) => void;
}

const W = 1000;
const H = 560;
const palette = {
  museum: '#3b82f6',
  province: '#10b981',
  level: '#f59e0b',
  type: '#a855f7',
};

const unique = (arr: string[]) => Array.from(new Set(arr));

export default function NationalMuseumGraph({ museums, focusedMuseumName, onNodeClick }: Props) {
  const categories = [{ name: '博物馆名称' }, { name: '省份' }, { name: '定级' }, { name: '博物馆类型' }];

  if (!focusedMuseumName) {
    const initialNodes = museums.map((m, i) => ({
      name: m.name,
      category: 0,
      symbolSize: 46,
      x: 120 + (i % 3) * 360,
      y: 110 + Math.floor(i / 3) * 160,
      fixed: true,
      nodeType: 'museum' as const,
      itemStyle: { color: palette.museum, borderColor: '#ffffff', borderWidth: 2, shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.2)' },
    }));

    const option = {
      backgroundColor: '#ffffff',
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'graph',
          layout: 'none',
          roam: true,
          label: { show: true, color: '#334155', fontSize: 12 },
          data: initialNodes,
          links: [],
          categories,
          lineStyle: { color: '#cbd5e1', width: 1, opacity: 0.6 },
          emphasis: { label: { fontWeight: 600 } },
        },
      ],
    };

    return <ReactECharts style={{ height: H }} option={option} onEvents={{ click: (e: any) => onNodeClick({ name: e.name, nodeType: 'museum' }) }} />;
  }

  const centerMuseum = museums.find((m) => m.name === focusedMuseumName) || museums[0];
  const sameProvince = museums.filter((m) => m.province === centerMuseum.province).map((m) => m.name);
  const sameLevel = museums.filter((m) => m.level === centerMuseum.level).map((m) => m.name);
  const sameType = museums.filter((m) => m.museumType === centerMuseum.museumType).map((m) => m.name);

  const centerX = W / 2;
  const centerY = H / 2;

  const nodes: any[] = [
    { name: centerMuseum.name, category: 0, symbolSize: 64, x: centerX, y: centerY, fixed: true, nodeType: 'museum' as const, itemStyle: { color: palette.museum, borderColor: '#fff', borderWidth: 2.5, shadowBlur: 12, shadowColor: 'rgba(59,130,246,0.28)' } },
    { name: centerMuseum.province, category: 1, symbolSize: 44, x: centerX - 220, y: centerY - 130, fixed: true, nodeType: 'province' as const, itemStyle: { color: palette.province, borderColor: '#fff', borderWidth: 2 } },
    { name: centerMuseum.level, category: 2, symbolSize: 44, x: centerX, y: centerY - 210, fixed: true, nodeType: 'level' as const, itemStyle: { color: palette.level, borderColor: '#fff', borderWidth: 2 } },
    { name: centerMuseum.museumType, category: 3, symbolSize: 44, x: centerX + 220, y: centerY - 130, fixed: true, nodeType: 'type' as const, itemStyle: { color: palette.type, borderColor: '#fff', borderWidth: 2 } },
  ];

  const links: any[] = [
    { source: centerMuseum.name, target: centerMuseum.province, label: { show: true, formatter: '位于', color: '#94a3b8', fontSize: 11 } },
    { source: centerMuseum.name, target: centerMuseum.level, label: { show: true, formatter: '定级为', color: '#94a3b8', fontSize: 11 } },
    { source: centerMuseum.name, target: centerMuseum.museumType, label: { show: true, formatter: '类型属于', color: '#94a3b8', fontSize: 11 } },
  ];

  const museumNamesAdded = new Set<string>([centerMuseum.name]);
  const addMuseumsAround = (names: string[], anchorX: number, anchorY: number, relationNode: string) => {
    unique(names).filter((n) => n !== centerMuseum.name).forEach((name, idx) => {
      if (!museumNamesAdded.has(name)) {
        nodes.push({ name, category: 0, symbolSize: 34, x: anchorX + (idx % 3) * 95 - 95, y: anchorY + Math.floor(idx / 3) * 80, fixed: true, nodeType: 'museum' as const, itemStyle: { color: '#93c5fd', borderColor: '#fff', borderWidth: 1.5 } });
        museumNamesAdded.add(name);
      }
      links.push({ source: relationNode, target: name, label: { show: false, formatter: '' } });
    });
  };

  addMuseumsAround(sameProvince, centerX - 300, centerY + 40, centerMuseum.province);
  addMuseumsAround(sameLevel, centerX - 90, centerY + 120, centerMuseum.level);
  addMuseumsAround(sameType, centerX + 130, centerY + 40, centerMuseum.museumType);

  const option = {
    backgroundColor: '#ffffff',
    tooltip: { trigger: 'item' },
    legend: { data: ['博物馆名称', '省份', '定级', '博物馆类型'], textStyle: { color: '#64748b', fontSize: 12 } },
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        label: { show: true, color: '#334155', fontSize: 12 },
        edgeSymbol: ['none', 'none'],
        data: nodes,
        links,
        categories,
        lineStyle: { color: '#cbd5e1', width: 1.2, opacity: 0.8, curveness: 0.08 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 1.6, opacity: 1 } },
      },
    ],
  };

  return (
    <ReactECharts
      style={{ height: H }}
      option={option}
      onEvents={{
        click: (e: any) => {
          const hit = nodes.find((n) => n.name === e.name);
          if (hit) onNodeClick({ name: hit.name, nodeType: hit.nodeType });
        },
      }}
    />
  );
}
