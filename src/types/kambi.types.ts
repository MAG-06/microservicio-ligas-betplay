export interface KambiGroup {
  id: number;
  name: string;
  englishName?: string;
  termKey: string;
  eventCount?: number;
  groups?: KambiGroup[];
}

export interface KambiGroupTree {
  group: { groups: KambiGroup[] };
}
