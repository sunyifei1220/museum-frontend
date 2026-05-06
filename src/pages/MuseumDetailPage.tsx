import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useMuseumStore } from '../store/museumStore';

const kv = (k: string, v: any) => <div className="rounded bg-slate-50 p-2"><p className="text-xs text-slate-500">{k}</p><p className="text-sm text-slate-900">{v || '-'}</p></div>;

export default function MuseumDetailPage() {
  const { id } = useParams();
  const { allDataById, nationalMuseums, initData, loaded } = useMuseumStore();
  useEffect(() => { void initData(); }, [initData]);
  if (!loaded) return <div className="panel">数据加载中...</div>;

  const museum = id ? allDataById[id] : null;
  if (!museum) return <div className="panel">未找到博物馆</div>;
  const related = Object.values(allDataById).filter((m: any) => m.id !== museum.id && (m.province === museum.province || m.level === museum.level)).slice(0, 6);

  return <div className="space-y-4"><section className="panel"><h2 className="text-lg font-semibold">{museum.name}</h2><p className="mt-1 text-sm text-slate-500">{museum.category}</p></section><section className="panel grid grid-cols-2 gap-3 md:grid-cols-4">{kv('等级', museum.level)}{kv('博物馆性质', museum.nature)}{kv('省份', museum.province)}{kv('是否免费开放', museum.isFreeOpen)}</section><section className="panel grid grid-cols-2 gap-3 md:grid-cols-5">{kv('藏品数量', museum.collectionsCount)}{kv('珍贵文物数量', museum.preciousRelicsCount)}{kv('展览数量', museum.exhibitionsCount)}{kv('教育活动数量', museum.educationActivitiesCount)}{kv('年接待人数', museum.annualVisitors)}</section>{museum.category !== '全国博物馆' && <section className="panel grid grid-cols-1 gap-3 md:grid-cols-2">{kv('详细地址', (museum as any).address)}{kv('官网链接', (museum as any).officialWebsite ? <a className='text-brand-700 hover:underline' href={(museum as any).officialWebsite} target='_blank'>访问官网</a> : '-')}</section>}{museum.category === '国家级博物馆' && <><section className="panel grid grid-cols-2 gap-3 md:grid-cols-4">{kv('博物馆类型', (museum as any).museumType)}{kv('城市', (museum as any).city)}{kv('经纬度', `${(museum as any).coordinates.lng}, ${(museum as any).coordinates.lat}`)}{kv('信息获取方式', (museum as any).infoAccessMethod)}</section><section className="panel grid grid-cols-1 gap-3 md:grid-cols-2">{kv('数字藏品链接', (museum as any).digitalCollectionLink ? <a className='text-brand-700 hover:underline' href={(museum as any).digitalCollectionLink} target='_blank'>查看数字藏品</a> : '-')}{kv('是否需要申请', (museum as any).applyRequired)}</section></>}
    <section className="panel"><h3 className="font-semibold">相关推荐</h3><div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">{related.map((r: any) => <Link key={r.id} to={`/museums/${r.id}`} className="rounded border border-slate-200 p-2 hover:border-brand-500">{r.name}</Link>)}</div>{museum.category === '国家级博物馆' && <p className="mt-3 text-xs text-slate-500">同类型馆数量：{nationalMuseums.filter((m) => m.museumType === (museum as any).museumType).length}</p>}</section></div>;
}
