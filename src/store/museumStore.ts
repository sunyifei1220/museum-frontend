import { create } from 'zustand';
import { loadMuseumData } from '../services/museumDataService';
import type { AllMuseum, FirstClassMuseum, Museum, MuseumCategory, NationalMuseum } from '../types/museum';

interface MuseumUIState {
  category: MuseumCategory;
  listViewMode: 'table' | 'card';
  allMuseums: AllMuseum[];
  firstClassMuseums: FirstClassMuseum[];
  nationalMuseums: NationalMuseum[];
  allDataById: Record<string, Museum>;
  loaded: boolean;
  loading: boolean;
  setCategory: (category: MuseumCategory) => void;
  setListViewMode: (mode: 'table' | 'card') => void;
  initData: () => Promise<void>;
}

export const useMuseumStore = create<MuseumUIState>((set, get) => ({
  category: '全国博物馆',
  listViewMode: 'table',
  allMuseums: [],
  firstClassMuseums: [],
  nationalMuseums: [],
  allDataById: {},
  loaded: false,
  loading: false,
  setCategory: (category) => set({ category }),
  setListViewMode: (mode) => set({ listViewMode: mode }),
  initData: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    const data = await loadMuseumData();
    set({ ...data, loaded: true, loading: false });
  },
}));
