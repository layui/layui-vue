import { Slots } from "vue";

export const TabInjectKey = Symbol("layuiTab");

export interface TabData {
  id: string;
  title?: string;
  closable?: string | boolean;
  slots: Slots;
}

export interface TabsContext {
  active: string;
  addItem: (id: string, data: TabData) => void;
  removeItem: (id: string) => void;
}
