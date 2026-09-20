import Constants from 'expo-constants';

type Extra = {
  appEnv?: string;
  apiBaseUrl?: string;
  googleWebClientId?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

export const Config = {
  appEnv: extra.appEnv ?? 'development',
  apiBaseUrl: extra.apiBaseUrl ?? 'http://localhost:3000/api/v1',
  googleWebClientId: extra.googleWebClientId ?? '',
} as const;
