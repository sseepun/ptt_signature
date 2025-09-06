import { createContext, useState, useEffect } from 'react';
import { UserModel } from '@/models';

import { Storage } from '@/helpers/storage';
import { APP_PREFIX } from '@/actions/variables';
import { makeRequest } from '@/helpers/api';

const AuthContext = createContext({
  status: 'loading',
  isSignedIn: false,

  user: new UserModel(),
  accessToken: null,
  refreshToken: null,

  onSignin: () => {},
  onSignout: () => {},

  onUpdate: () => {},
});

export const AuthContextProvider = (props) => {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(new UserModel());
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const onSignin = async ({ u, aToken, rToken, tenant=null, app=null }) => {
    try {
      if(u && aToken && rToken){
        const _user = new UserModel(u);
        if(_user.isSignedIn()){
          Storage.setItem(`${APP_PREFIX}_USER`, _user);
          Storage.setItem(`${APP_PREFIX}_ACCESS`, aToken);
          Storage.setItem(`${APP_PREFIX}_REFRESH`, rToken);

          if(tenant && app){
            Storage.setItem(`${APP_PREFIX}_MSAL_TENANT`, JSON.stringify(tenant));
            Storage.setItem(`${APP_PREFIX}_MSAL_APP`, JSON.stringify(app));
          }

          setStatus('authenticated');
          setUser(_user);
          setAccessToken(aToken);
          setRefreshToken(rToken);
          return true;
        }
      }
    } catch {}
    onSignout();
    return false;
  }
  const onSignout = () => {
    setStatus('unauthenticated');
    setUser(new UserModel());
    Storage.removeItem(`${APP_PREFIX}_USER`);
    Storage.removeItem(`${APP_PREFIX}_ACCESS`);
    Storage.removeItem(`${APP_PREFIX}_REFRESH`);
    Storage.removeItem(`${APP_PREFIX}_MSAL_TENANT`);
    Storage.removeItem(`${APP_PREFIX}_MSAL_APP`);
    return true;
  }

  const onUpdate = (_user=new UserModel()) => {
    if(status === 'authenticated' && user.isSignedIn()){
      const _newUser = {
        ...user,
        firstname: _user?.firstname || user.firstname,
        lastname: _user?.lastname || user.lastname,
        username: _user?.username || user.username,
        email: _user?.email || user.email,
        avatar: _user?.avatar || user.avatar,
        address: _user?.address || user.address,
      };
      setUser(new UserModel(_newUser));
      Storage.setItem(`${APP_PREFIX}_USER`, JSON.stringify(_newUser));
    }
    return true;
  }

  /* eslint-disable */
  useEffect(() => {
    const onLoad = async () => {
      if(status !== 'loading') return () => {};

      let _user = Storage.getItem(`${APP_PREFIX}_USER`);
      const _accessToken = Storage.getItem(`${APP_PREFIX}_ACCESS`);
      const _refreshToken = Storage.getItem(`${APP_PREFIX}_REFRESH`);
      if(!_accessToken || !_refreshToken || !_user){ onSignout(); return () => {}; }

      try {
        _user = new UserModel(_user || {});

        const _fetch = await makeRequest('PATCH', '/api/refresh', {}, _accessToken);
        if(_fetch.ok && _fetch.status === 200){
          const _res = await _fetch.json();
          if(_res){
            await onSignin({ u: _user, aToken: _accessToken, rToken: _refreshToken });
            return () => {};
          }
        }
      } catch {}
      onSignout(); return () => {};
    }
    onLoad();
  }, [])
  /* eslint-enable */

  return (
    <AuthContext.Provider 
      value={{
        status: status,
        isSignedIn: user.isSignedIn() && status === 'authenticated',

        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,

        onSignin: onSignin,
        onSignout: onSignout,

        onUpdate: onUpdate,
      }} 
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;