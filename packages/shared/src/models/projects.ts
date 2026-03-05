export interface CreateProjectBody {
  name: string;
  engineTemplateId: number;
}

export interface UpsertSettingBody {
  key: string;
  value: string;
}
