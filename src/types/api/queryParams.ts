export type IBaseQueryParams = {
  filter?: string;
  fields?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  select?: string;
};
