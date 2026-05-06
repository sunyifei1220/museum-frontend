import type { AllMuseum, FirstClassMuseum, NationalMuseum } from '../types/museum';

const provinces = ['北京', '上海', '广东', '浙江', '江苏', '四川', '陕西', '湖北', '山东', '河南'];
const levels = ['国家一级博物馆', '国家二级博物馆', '国家三级博物馆', '未定级'] as const;
const natures = ['国有', '非国有', '其他', '未明确'] as const;

export const allMuseums: AllMuseum[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `all-${i + 1}`,
  category: '全国博物馆',
  name: `全国博物馆样例馆-${i + 1}`,
  level: levels[i % 4],
  nature: natures[i % 4],
  province: provinces[i % provinces.length],
  isFreeOpen: ['是', '否', '部分'][i % 3] as '是' | '否' | '部分',
  collectionsCount: 5000 + i * 600,
  preciousRelicsCount: 200 + i * 30,
  exhibitionsCount: 10 + (i % 9),
  educationActivitiesCount: 12 + (i % 8),
  annualVisitors: 60000 + i * 10000,
}));

export const firstClassMuseums: FirstClassMuseum[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `first-${i + 1}`,
  category: '国家一级博物馆',
  name: `一级博物馆样例馆-${i + 1}`,
  level: '国家一级博物馆',
  nature: (['国有', '非国有', '其他'] as const)[i % 3],
  province: provinces[(i + 2) % provinces.length],
  address: `${provinces[(i + 2) % provinces.length]}示例路${100 + i}号`,
  isFreeOpen: ['是', '否', '部分'][i % 3] as '是' | '否' | '部分',
  collectionsCount: 15000 + i * 800,
  preciousRelicsCount: 1000 + i * 60,
  exhibitionsCount: 25 + (i % 10),
  educationActivitiesCount: 30 + (i % 11),
  annualVisitors: 150000 + i * 22000,
  officialWebsite: i % 4 === 0 ? '' : `https://museum-first-${i + 1}.example.com`,
}));

export const nationalMuseums: NationalMuseum[] = [
  { id: 'national-1', category: '国家级博物馆', name: '国家博物馆示例馆', level: '国家一级博物馆', nature: '国有', museumType: '综合类', province: '北京', city: '北京', address: '东城区东长安街16号', coordinates: { lng: 116.4074, lat: 39.9042 }, isFreeOpen: '是', collectionsCount: 120000, preciousRelicsCount: 25000, exhibitionsCount: 80, educationActivitiesCount: 95, annualVisitors: 6800000, officialWebsite: 'https://nationalmuseum.example.com', digitalCollectionLink: 'https://nationalmuseum.example.com/digital', infoAccessMethod: '官网公开', applyRequired: '否' },
  { id: 'national-2', category: '国家级博物馆', name: '上海历史博物馆示例馆', level: '国家一级博物馆', nature: '国有', museumType: '历史类', province: '上海', city: '上海', address: '黄浦区南京西路325号', coordinates: { lng: 121.4737, lat: 31.2304 }, isFreeOpen: '是', collectionsCount: 86000, preciousRelicsCount: 17000, exhibitionsCount: 50, educationActivitiesCount: 63, annualVisitors: 3200000, officialWebsite: 'https://shmuseum.example.com', digitalCollectionLink: '', infoAccessMethod: '网页可抓取', applyRequired: '部分' },
  { id: 'national-3', category: '国家级博物馆', name: '广东美术馆示例馆', level: '国家二级博物馆', nature: '其他', museumType: '艺术类', province: '广东', city: '广州', address: '海珠区艺洲路1号', coordinates: { lng: 113.2644, lat: 23.1291 }, isFreeOpen: '部分', collectionsCount: 45000, preciousRelicsCount: 8000, exhibitionsCount: 42, educationActivitiesCount: 58, annualVisitors: 1800000, officialWebsite: 'https://gdart.example.com', digitalCollectionLink: 'https://gdart.example.com/digital', infoAccessMethod: '数字藏品平台', applyRequired: '否' },
  { id: 'national-4', category: '国家级博物馆', name: '四川自然博物馆示例馆', level: '国家二级博物馆', nature: '国有', museumType: '自然类', province: '四川', city: '成都', address: '成华区熊猫大道88号', coordinates: { lng: 104.0665, lat: 30.5728 }, isFreeOpen: '是', collectionsCount: 39000, preciousRelicsCount: 5000, exhibitionsCount: 30, educationActivitiesCount: 40, annualVisitors: 1350000, officialWebsite: 'https://scnature.example.com', digitalCollectionLink: '', infoAccessMethod: '开放数据平台', applyRequired: '未明确' },
  { id: 'national-5', category: '国家级博物馆', name: '江苏科技博物馆示例馆', level: '国家三级博物馆', nature: '非国有', museumType: '科技类', province: '江苏', city: '南京', address: '玄武区科创路23号', coordinates: { lng: 118.7969, lat: 32.0603 }, isFreeOpen: '否', collectionsCount: 28000, preciousRelicsCount: 3200, exhibitionsCount: 35, educationActivitiesCount: 47, annualVisitors: 980000, officialWebsite: 'https://jssci.example.com', digitalCollectionLink: 'https://jssci.example.com/digital', infoAccessMethod: '需申请获取', applyRequired: '是' },
  { id: 'national-6', category: '国家级博物馆', name: '陕西遗址博物馆示例馆', level: '国家一级博物馆', nature: '国有', museumType: '遗址类', province: '陕西', city: '西安', address: '未央区遗址大道66号', coordinates: { lng: 108.9398, lat: 34.3416 }, isFreeOpen: '部分', collectionsCount: 72000, preciousRelicsCount: 14000, exhibitionsCount: 38, educationActivitiesCount: 54, annualVisitors: 2420000, officialWebsite: 'https://sxsite.example.com', digitalCollectionLink: '', infoAccessMethod: '合作获取', applyRequired: '部分' },
  { id: 'national-7', category: '国家级博物馆', name: '湖北纪念馆示例馆', level: '国家二级博物馆', nature: '国有', museumType: '纪念馆类', province: '湖北', city: '武汉', address: '武昌区纪念路9号', coordinates: { lng: 114.3054, lat: 30.5931 }, isFreeOpen: '是', collectionsCount: 51000, preciousRelicsCount: 7600, exhibitionsCount: 28, educationActivitiesCount: 33, annualVisitors: 1680000, officialWebsite: 'https://hbmemorial.example.com', digitalCollectionLink: 'https://hbmemorial.example.com/digital', infoAccessMethod: '官网公开', applyRequired: '否' },
  { id: 'national-8', category: '国家级博物馆', name: '山东民俗博物馆示例馆', level: '国家三级博物馆', nature: '其他', museumType: '民俗与非遗类', province: '山东', city: '济南', address: '历下区民俗街18号', coordinates: { lng: 117.1201, lat: 36.6512 }, isFreeOpen: '部分', collectionsCount: 32000, preciousRelicsCount: 4100, exhibitionsCount: 22, educationActivitiesCount: 29, annualVisitors: 890000, officialWebsite: 'https://sdfolk.example.com', digitalCollectionLink: '', infoAccessMethod: '未明确', applyRequired: '未明确' },
  { id: 'national-9', category: '国家级博物馆', name: '河南专题博物馆示例馆', level: '未定级', nature: '非国有', museumType: '专题类', province: '河南', city: '郑州', address: '金水区文化路120号', coordinates: { lng: 113.6254, lat: 34.7466 }, isFreeOpen: '否', collectionsCount: 21000, preciousRelicsCount: 2500, exhibitionsCount: 20, educationActivitiesCount: 21, annualVisitors: 760000, officialWebsite: '', digitalCollectionLink: 'https://hntopic.example.com/digital', infoAccessMethod: '数字藏品平台', applyRequired: '是' },
];

export const allDataById = [...allMuseums, ...firstClassMuseums, ...nationalMuseums].reduce<Record<string, any>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
