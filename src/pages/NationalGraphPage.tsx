import { useEffect, useMemo, useState } from 'react';
import NationalMuseumGraph from '../components/NationalMuseumGraph';
import { useMuseumStore } from '../store/museumStore';

export default function NationalGraphPage() {
  const { nationalMuseums, initData, loaded } = useMuseumStore();
  useEffect(() => {
    void initData();
  }, [initData]);

  const seedMuseums = useMemo(() => nationalMuseums.slice(0, 9), [nationalMuseums]);
  const [focusedMuseumName, setFocusedMuseumName] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ name: string; nodeType: 'museum' | 'province' | 'level' | 'type' } | null>(null);

  const groupedNames = useMemo(() => {
    if (!selected) return [] as string[];
    if (selected.nodeType === 'museum') return [selected.name];
    if (selected.nodeType === 'province') return seedMuseums.filter((m) => m.province === selected.name).map((m) => m.name);
    if (selected.nodeType === 'level') return seedMuseums.filter((m) => m.level === selected.name).map((m) => m.name);
    return seedMuseums.filter((m) => m.museumType === selected.name).map((m) => m.name);
  }, [selected, seedMuseums]);

  if (!loaded) return <div className="panel">数据加载中...</div>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <aside className="panel lg:col-span-3 space-y-3">
        <h2 className="font-semibold">关系图说明</h2>
        <p className="text-sm text-slate-600">初始仅展示 9 个国家级博物馆名称节点</p>
        <p className="text-sm text-slate-600">点击博物馆后：居中聚焦并展开省份/定级/类型关联</p>
        {focusedMuseumName ? (
          <button className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100" onClick={() => { setFocusedMuseumName(null); setSelected(null); }}>
            返回初始 9 节点
          </button>
        ) : null}
      </aside>

      <section className="panel lg:col-span-6">
        <NationalMuseumGraph
          museums={seedMuseums}
          focusedMuseumName={focusedMuseumName}
          onNodeClick={(payload) => {
            setSelected(payload);
            if (payload.nodeType === 'museum') setFocusedMuseumName(payload.name);
          }}
        />
      </section>

      <aside className="panel lg:col-span-3">
        <h2 className="font-semibold">节点详情</h2>
        {!selected ? (
          <p className="mt-3 text-sm text-slate-500">点击图谱节点查看详情</p>
        ) : (
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>节点名称：{selected.name}</p>
            <p>节点类型：{selected.nodeType}</p>
            <p className="pt-1 font-medium text-slate-900">该分类下博物馆</p>
            <div className="max-h-72 overflow-auto rounded border border-slate-200 p-2">
              {groupedNames.length === 0 ? (
                <p className="text-slate-500">无匹配</p>
              ) : (
                groupedNames.map((name) => (
                  <p key={name} className="py-0.5 text-slate-700">
                    {name}
                  </p>
                ))
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
