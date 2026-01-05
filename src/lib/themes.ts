export type ThemeName = 'default' | 'modern';

export interface Theme {
  name: ThemeName;
  label: string;
  description: string;
}

export const themes: Theme[] = [
  {
    name: 'default',
    label: 'Classic',
    description: '经典主题，简洁优雅'
  },
  {
    name: 'modern',
    label: 'Modern',
    description: '现代主题，时尚前卫'
  }
];

export const getTheme = (name: ThemeName): Theme => {
  return themes.find(t => t.name === name) || themes[0];
};
