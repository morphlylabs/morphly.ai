import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type SupportedModel } from '@/lib/ai/models';

interface ModelState {
  selectedModel: SupportedModel;
}

interface ModelActions {
  setSelectedModel: (model: SupportedModel) => void;
}

export const useModelStore = create<ModelState & ModelActions>()(
  persist(
    set => ({
      selectedModel: 'meta/llama-4-maverick',
      setSelectedModel: model => set({ selectedModel: model }),
    }),
    { name: 'model-store' },
  ),
);

export const useSelectedModel = () =>
  useModelStore(state => state.selectedModel);

export const useSetSelectedModel = () =>
  useModelStore(state => state.setSelectedModel);
