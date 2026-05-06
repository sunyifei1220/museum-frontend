export const MuseumCategories = ['国家级博物馆', '国家一级博物馆', '全国博物馆'] as const;
export type MuseumCategory = (typeof MuseumCategories)[number];

export const MuseumLevels = ['国家一级博物馆', '国家二级博物馆', '国家三级博物馆', '未定级'] as const;
export type MuseumLevel = (typeof MuseumLevels)[number];

export const MuseumNatures = ['国有', '非国有', '其他', '未明确'] as const;
export type MuseumNature = (typeof MuseumNatures)[number];

export const MuseumTypes = ['综合类', '历史类', '艺术类', '自然类', '科技类', '遗址类', '纪念馆类', '民俗与非遗类', '专题类'] as const;
export type MuseumType = (typeof MuseumTypes)[number];

export const InfoAccessMethods = ['官网公开', '网页可抓取', '开放数据平台', '数字藏品平台', '需申请获取', '合作获取', '未明确'] as const;
export type InfoAccessMethod = (typeof InfoAccessMethods)[number];

export const ApplyStatuses = ['是', '否', '部分', '未明确'] as const;
export type ApplyStatus = (typeof ApplyStatuses)[number];

export type FreeOpenStatus = '是' | '否' | '部分';

export interface MuseumBase {
  id: string;
  category: MuseumCategory;
  name: string;
  level: MuseumLevel;
  nature: MuseumNature;
  province: string;
  isFreeOpen: FreeOpenStatus;
  collectionsCount: number;
  preciousRelicsCount: number;
  exhibitionsCount: number;
  educationActivitiesCount: number;
  annualVisitors: number;
}

export interface AllMuseum extends MuseumBase {
  category: '全国博物馆';
}

export interface FirstClassMuseum extends MuseumBase {
  category: '国家一级博物馆';
  address: string;
  officialWebsite?: string;
}

export interface NationalMuseum extends MuseumBase {
  category: '国家级博物馆';
  museumType: MuseumType;
  city: string;
  address: string;
  coordinates: {
    lng: number;
    lat: number;
  };
  officialWebsite?: string;
  digitalCollectionLink?: string;
  infoAccessMethod: InfoAccessMethod;
  applyRequired: ApplyStatus;
}

export type Museum = AllMuseum | FirstClassMuseum | NationalMuseum;

export interface MuseumQueryParams {
  category: MuseumCategory;
  page: number;
  pageSize: number;
  name?: string;
  level?: MuseumLevel;
  nature?: MuseumNature;
  province?: string;
  isFreeOpen?: FreeOpenStatus;
  hasOfficialWebsite?: boolean;
  museumType?: MuseumType;
  city?: string;
  hasDigitalCollection?: boolean;
  infoAccessMethod?: InfoAccessMethod;
  applyRequired?: ApplyStatus;
}
