import { APP_URL } from '@/actions/variables';

export const AzureMsalCreateConfig = (tenant, app) => {
  if(!tenant || !app) return {};
  let auth = {
    clientId: `${app.client_id}`,
    authority: `${app.authority[0].url}`,
    redirectUri: APP_URL,
    navigateToLoginRequestUrl: false,
  };
  if(tenant.b2c === 'Y'){
    auth.knownAuthorities = [`${app.knownAuthorities}`];
    auth.postLogoutRedirectUri = APP_URL;
  }
  return {
    auth,
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
    system: {},
  };
}
