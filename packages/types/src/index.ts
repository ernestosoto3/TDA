export interface ApplicationInfo {
  name: string;
  environment: 'development' | 'test' | 'production';
}

export type ApplicationName = 'mobile' | 'api' | 'admin';
