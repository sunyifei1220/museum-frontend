import Papa from 'papaparse';
import type { AllMuseum, FirstClassMuseum, Museum, MuseumNature, MuseumType, NationalMuseum } from '../types/museum';

const CSV_ALL = '/data/国家博物馆名录.csv';
const CSV_FIRST = '/data/国家一级博物馆.csv';
const CSV_NATIONAL = '/data/国家级博物馆.csv';

const toNature = (raw: string): MuseumNature => {
  if (!raw) return '未明确';
  if (raw.includes('非国有')) return '非国有';
  if (raw.includes('国有')) return '国有';
  if (raw.includes('其他')) return '其他';
  return '未明确';
};
const toLevel = (raw: string) => {
  const s = (raw || '').trim();
  if (s === '一级' || s === '国家一级博物馆') return '国家一级博物馆' as const;
  if (s === '二级' || s === '国家二级博物馆') return '国家二级博物馆' as const;
  if (s === '三级' || s === '国家三级博物馆') return '国家三级博物馆' as const;
  return '未定级' as const;
};
const toFree = (raw: string) => ((raw || '').trim().includes('是') ? '是' : (raw || '').trim().includes('否') ? '否' : '部分') as '是' | '否' | '部分';
const toNumber = (raw: string) => {
  const n = Number(String(raw || '').replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
};
const parseCsv = async <T = Record<string, string>>(url: string): Promise<T[]> => {
  const text = await fetch(url).then((r) => r.text());
  return Papa.parse<T>(text, { header: true, skipEmptyLines: true }).data;
};
const normalizeType = (raw: string): MuseumType => {
  const s = (raw || '').replace(/\s+/g, '');
  if (s.includes('综合')) return '综合类';
  if (s.includes('历史')) return '历史类';
  if (s.includes('艺术')) return '艺术类';
  if (s.includes('自然')) return '自然类';
  if (s.includes('科技')) return '科技类';
  if (s.includes('遗址')) return '遗址类';
  if (s.includes('纪念馆')) return '纪念馆类';
  if (s.includes('民俗') || s.includes('非遗')) return '民俗与非遗类';
  return '专题类';
};
const normalizeAccess = (raw: string) => {
  const s = (raw || '').replace(/\s+/g, '');
  if (s.includes('官网')) return '官网公开' as const;
  if (s.includes('爬取')) return '网页可抓取' as const;
  if (s.includes('开放数据') || s.includes('下载')) return '开放数据平台' as const;
  if (s.includes('数字藏品')) return '数字藏品平台' as const;
  if (s.includes('申请')) return '需申请获取' as const;
  if (s.includes('合作') || s.includes('授权')) return '合作获取' as const;
  return '未明确' as const;
};
const normalizeApply = (raw: string) => {
  const s = (raw || '').replace(/\s+/g, '');
  if (s.includes('需') || s.includes('是')) return '是' as const;
  if (s.includes('否') || s.includes('不需')) return '否' as const;
  if (s.includes('部分') || s.includes('高清') || s.includes('文创')) return '部分' as const;
  return '未明确' as const;
};
const parseLngLat = (raw: string) => {
  const [lat, lng] = (raw || '').replace(/"/g, '').split(',').map((v) => Number(v.trim()));
  return { lng: Number.isFinite(lng) ? lng : 0, lat: Number.isFinite(lat) ? lat : 0 };
};

export const loadMuseumData = async () => {
  const [allRows, firstRows, nationalRows] = await Promise.all([
    parseCsv<Record<string, string>>(CSV_ALL),
    parseCsv<Record<string, string>>(CSV_FIRST),
    parseCsv<Record<string, string>>(CSV_NATIONAL),
  ]);

  const allMuseums: AllMuseum[] = allRows.map((r, i) => ({
    id: `all-${i + 1}`,
    category: '全国博物馆',
    name: r['博物馆名称']?.trim() || `全国馆-${i + 1}`,
    level: toLevel(r['质量等级']),
    nature: toNature(r['性质']),
    province: (r['省份'] || '').replace('省', '').trim(),
    isFreeOpen: toFree(r['是否免费开放']),
    collectionsCount: toNumber(r['藏品数（件/套）']),
    preciousRelicsCount: toNumber(r['珍贵文物（件/套）']),
    exhibitionsCount: toNumber(r['展览（个）']),
    educationActivitiesCount: toNumber(r['教育活动（次）']),
    annualVisitors: Math.round(toNumber(r['参观人数（万人次）']) * 10000),
  }));

  const allByName = allMuseums.reduce<Record<string, AllMuseum>>((acc, m) => ((acc[m.name] = m), acc), {});

  const firstClassMuseums: FirstClassMuseum[] = firstRows.map((r, i) => {
    const name = r['博物馆名称']?.trim() || `一级馆-${i + 1}`;
    const fromAll = allByName[name];
    return {
      id: `first-${i + 1}`,
      category: '国家一级博物馆',
      name,
      level: toLevel(r['定级']),
      nature: fromAll?.nature || '未明确',
      province: (r['省份'] || '').replace('省', '').trim(),
      address: (r['地址'] || '').trim(),
      isFreeOpen: fromAll?.isFreeOpen || '部分',
      collectionsCount: fromAll?.collectionsCount || 0,
      preciousRelicsCount: fromAll?.preciousRelicsCount || 0,
      exhibitionsCount: fromAll?.exhibitionsCount || 0,
      educationActivitiesCount: fromAll?.educationActivitiesCount || 0,
      annualVisitors: fromAll?.annualVisitors || 0,
      officialWebsite: (r['官网链接'] || '').trim(),
    };
  });

  const nationalMuseums: NationalMuseum[] = nationalRows.map((r, i) => ({
    id: `national-${i + 1}`,
    category: '国家级博物馆',
    name: r['博物馆名称']?.trim() || `国家级馆-${i + 1}`,
    level: toLevel(r['定级']),
    nature: '国有',
    museumType: normalizeType((r['博物馆分类'] || '').split(';')[0]),
    province: (r['省份'] || '').replace('省', '').trim(),
    city: (r['城市'] || '').trim(),
    address: (r['地址'] || '').trim(),
    coordinates: parseLngLat(r['经纬度'] || ''),
    isFreeOpen: '部分',
    collectionsCount: 0,
    preciousRelicsCount: 0,
    exhibitionsCount: 0,
    educationActivitiesCount: 0,
    annualVisitors: 0,
    officialWebsite: (r['官网链接'] || '').trim(),
    digitalCollectionLink: (r['数字藏品链接'] || '').trim(),
    infoAccessMethod: normalizeAccess(r['数据获取方式'] || ''),
    applyRequired: normalizeApply(r['是否需要授权'] || ''),
  }));

  const allDataById = [...allMuseums, ...firstClassMuseums, ...nationalMuseums].reduce<Record<string, Museum>>((acc, m) => ((acc[m.id] = m), acc), {});
  return { allMuseums, firstClassMuseums, nationalMuseums, allDataById };
};
