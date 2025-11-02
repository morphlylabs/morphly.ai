import { create } from 'zustand';
import { type SupportedModel } from '@/lib/ai/models';

interface ModelState {
  selectedModel: SupportedModel;
}

interface ModelActions {
  setSelectedModel: (model: SupportedModel) => void;
}

export const useModelStore = create<ModelState & ModelActions>()(set => ({
  selectedModel: 'openai/gpt-5',
  setSelectedModel: model => set({ selectedModel: model }),
}));

export const useSelectedModel = () =>
  useModelStore(state => state.selectedModel);

export const useSetSelectedModel = () =>
  useModelStore(state => state.setSelectedModel);
