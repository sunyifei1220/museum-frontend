import { Link } from 'react-router-dom';
import type { Museum, MuseumCategory } from '../types/museum';

interface Props {
  category: MuseumCategory;
  data: Museum[];
}

const text = (v?: string) => (v && v.length > 0 ? v : '-');

export default function MuseumListView({ category, data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((m) => (
        <Link key={m.id} to={`/museums/${m.id}`} className="panel transition hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-50">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-semibold text-slate-900">{m.name}</h3>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{m.level}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
            <p>性质：{m.nature}</p>
            <p>省份：{m.province}</p>
            <p>免费开放：{m.isFreeOpen}</p>
            {category === '国家级博物馆' && 'city' in m ? <p>城市：{m.city}</p> : null}
            {category === '国家级博物馆' && 'museumType' in m ? <p>类型：{m.museumType}</p> : null}
          </div>

          {category !== '全国博物馆' && 'address' in m ? <p className="mt-3 text-xs text-slate-500">地址：{text(m.address)}</p> : null}

          {category === '全国博物馆' || category === '国家一级博物馆' ? (
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded bg-slate-50 p-2">
                <p className="text-slate-400">藏品</p>
                <p className="font-semibold text-slate-700">{m.collectionsCount}</p>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <p className="text-slate-400">展览</p>
                <p className="font-semibold text-slate-700">{m.exhibitionsCount}</p>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <p className="text-slate-400">教育活动</p>
                <p className="font-semibold text-slate-700">{m.educationActivitiesCount}</p>
              </div>
            </div>
          ) : null}

          {category !== '全国博物馆' && 'officialWebsite' in m && m.officialWebsite ? (
            <p className="mt-3 text-xs text-brand-700">官网可访问</p>
          ) : null}
          {category === '国家级博物馆' && 'digitalCollectionLink' in m && m.digitalCollectionLink ? (
            <p className="mt-1 text-xs text-brand-700">数字藏品可访问</p>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
