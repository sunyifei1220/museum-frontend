import { useMuseumStore } from '../store/museumStore';
import type { MuseumCategory } from '../types/museum';

export const useMuseumsByCategory = (category: MuseumCategory) => {
  const { allMuseums, firstClassMuseums, nationalMuseums } = useMuseumStore();
  if (category === '全国博物馆') return allMuseums;
  if (category === '国家一级博物馆') return firstClassMuseums;
  return nationalMuseums;
};
