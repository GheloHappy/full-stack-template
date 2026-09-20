import type { ConfigContext, ExpoConfig } from 'expo/config';

const environments = {
  development: { apiBaseUrl: 'http://localhost:3000/api/v1' },
  staging: { apiBaseUrl: 'https://staging-api.example.com/api/v1' },
  production: { apiBaseUrl: 'https://api.example.com/api/v1' },
} as const;

type AppEnvironment = keyof typeof environments;

export default ({ config }: ConfigContext): ExpoConfig => {
  const requested = process.env.APP_ENV ?? 'development';
  const appEnv: AppEnvironment =
    requested in environments ? (requested as AppEnvironment) : 'development';

  return {
    ...config,
    name: config.name ?? 'Full Stack Template',
    slug: config.slug ?? 'full-stack-template',
    extra: {
      ...config.extra,
      appEnv,
      apiBaseUrl: environments[appEnv].apiBaseUrl,
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? '',
    },
  };
};
