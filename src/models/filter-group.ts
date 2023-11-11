import { Filter } from './filter';

export enum FilterGroupKey {
  tags = 'tags',
  complexity = 'complexity',
  room = 'room'
}

export interface FilterGroup {
  title: string;
  key: FilterGroupKey;
  filters: Filter[];
}
