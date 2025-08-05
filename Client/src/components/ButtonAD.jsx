import { useEffect, useContext } from 'react';
import AuthContext from '@/context/AuthContext';

import { Button } from '@mui/material';

import { DEV_PROCESS, APP_URL } from '@/actions/variables';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { makeRequest } from '@/helpers/api';

export default function ButtonAD({ msalApplication, tenant, app, test=false, ...props }) {
  const { onSignin, onSignout } = useContext(AuthContext);
  
  const { accounts, instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const signinProcess = async (e) => {
    e.preventDefault();
    try {
      document.cookie = "msal.interaction.status=;";
      await instance.loginRedirect({
        scopes: [ 'User.Read' ],
        prompt: DEV_PROCESS? 'select_account': 'login',
      }).catch(err => console.log(err));
    } catch {}
  }

  const signinComplete = async () => {
    try {
      if(accounts?.[0]?.localAccountId){
        const _account = accounts[0];
        const token = await instance.acquireTokenSilent({ ...app.tokenRequest, account: _account });
        const _fetch = await makeRequest('POST', '/signin-ad', {
          TenantId: _account.tenantId,
          ClientId: app.client_id,
          AccessToken: token.accessToken,
          LocalAccountId: _account.localAccountId,
          HomeAccountId: _account.homeAccountId,
          Name: _account.name,
          Username: _account.username,
          IdToken: _account.idToken,
        });
        const res = await _fetch.json();
        if(res?.User?.AccessToken){
          onSignin({
            u: res.User,
            aToken: res.User.AccessToken,
            rToken: res.User.RefreshToken,
            tenant: tenant,
            app: app,
          });
          return;
        }
      }
    } catch {}
    instance.logoutRedirect({ postLogoutRedirectUri: APP_URL, onRedirectNavigate: (_) => false });
    onSignout();
    return;
  }

  useEffect(() => {
    if(isAuthenticated && inProgress === 'none') signinComplete();
  }, [isAuthenticated, inProgress]);

  return (
    <Button onClick={signinProcess} 
      variant="contained" color="primary" fullWidth disableElevation 
      size="large" className="bradius tt-unset" style={{ maxWidth: '18rem' }} 
    >
      <span className="h6">เข้าสู่ระบบ</span>
    </Button>
  );
}