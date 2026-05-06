import type { NationalMuseum } from '../types/museum';

interface Props { data: NationalMuseum[]; onSelect: (museum: NationalMuseum) => void; }

export default function MuseumMapPlaceholder({ data, onSelect }: Props) {
  return <div className="panel min-h-[520px]"><h3 className="mb-3 text-sm font-semibold text-slate-700">地图占位组件（保留真实地图接口）</h3><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{data.map((m) => <button key={m.id} className="rounded-lg border border-slate-200 p-3 text-left hover:border-brand-500 hover:bg-brand-50" onClick={() => onSelect(m)}><p className="font-medium text-slate-900">{m.name}</p><p className="mt-1 text-xs text-slate-500">{m.province} / {m.city} ({m.coordinates.lng.toFixed(2)}, {m.coordinates.lat.toFixed(2)})</p></button>)}</div></div>;
}
