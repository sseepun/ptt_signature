import { useEffect, useContext } from 'react';
import AuthContext from '@/context/AuthContext';

import { Button } from '@mui/material';

import { DEV_PROCESS, APP_URL } from '@/actions/variables';
// import { userSigninAD } from '@/actions/user.actions';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

export default function ButtonAD({ msalApplication, tenant, app, test=false, ...props }) {
  const { onSignin, onSignout } = useContext(AuthContext);
  
  const { accounts, instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const signinProcess = async (e) => {
    e.preventDefault();
    try {
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
        const _fetch = await fetch('/signin-ad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            TenantId: _account.tenantId,
            ClientId: app.client_id,
            AccessToken: token.accessToken,
            LocalAccountId: _account.localAccountId,
            HomeAccountId: _account.homeAccountId,
            Name: _account.name,
            Username: _account.username,
            IdToken: _account.idToken,
          }),
        });
        const _data = await _fetch.json();
        console.log(_data)
        // if(res?.accessToken){
        //   onSignin({
        //     aToken: res.accessToken,
        //     rToken: res.refreshToken,
        //     u: res.user,
        //     p: res.permissions,
        //     tenant: tenant,
        //     app: app,
        //   });
        //   return;
        // }
      }
    } catch {}
    instance.logoutRedirect({ postLogoutRedirectUri: APP_URL, onRedirectNavigate: (_) => false });
    onSignout();
    return;
  }

  const clickSignin = (e=null) => {
    e?.preventDefault();
    onSignin({
      Id: 1,
      EmployeeId: '1234567',
      Department: 'IT Department',
      IsAdmin: 1,
      Title: 'System Admin',
      Prefix: 'Mr.',
      FirstName: 'PTT',
      LastName: 'Employee',
      Email: 'employee@ptt.co.th',
      Avatar: '/img/avatar/01.png',
      Status: 1,
    }, 'ACCESS_TOKEN', 'REFRESH_TOKEN');
  }

  useEffect(() => {
    if(isAuthenticated && inProgress === 'none') signinComplete();
  }, [isAuthenticated, inProgress]);

  return (
    <Button onClick={false? clickSignin: signinProcess} 
      variant="contained" color="primary" fullWidth disableElevation 
      size="large" className="bradius tt-unset" style={{ maxWidth: '18rem' }} 
    >
      <span className="h6">เข้าสู่ระบบ</span>
    </Button>
  );
}