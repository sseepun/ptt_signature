import { createContext, useState, useEffect } from 'react';
import { UserModel } from '@/models';

import CryptoJS from 'crypto-js';
import { Storage } from '@/helpers/storage';
import { APP_PREFIX, TOKEN_KEY, REFRESH_KEY } from '@/actions/variables';
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
          const _u = CryptoJS.AES.encrypt(JSON.stringify(_user), TOKEN_KEY).toString();
          const _accessToken = CryptoJS.AES.encrypt(aToken, TOKEN_KEY).toString();
          const _refreshToken = CryptoJS.AES.encrypt(rToken, REFRESH_KEY).toString();
          
          Storage.setItem(`${APP_PREFIX}_USER`, _u);
          Storage.setItem(`${APP_PREFIX}_ACCESS`, _accessToken);
          Storage.setItem(`${APP_PREFIX}_REFRESH`, _refreshToken);

          if(tenant && app){
            Storage.setItem(`${APP_PREFIX}_MSAL_TENANT`, 
              CryptoJS.AES.encrypt(JSON.stringify(tenant), TOKEN_KEY).toString());
            Storage.setItem(`${APP_PREFIX}_MSAL_APP`, 
              CryptoJS.AES.encrypt(JSON.stringify(app), TOKEN_KEY).toString());
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
      Storage.setItem(`${APP_PREFIX}_USER`,
        CryptoJS.AES.encrypt(JSON.stringify(_newUser), TOKEN_KEY).toString());
    }
    return true;
  }

  /* eslint-disable */
  useEffect(() => {
    const onLoad = async () => {
      if(status !== 'loading') return () => {};

      let _user = Storage.getItem(`${APP_PREFIX}_USER`);
      let _accessToken = Storage.getItem(`${APP_PREFIX}_ACCESS`);
      let _refreshToken = Storage.getItem(`${APP_PREFIX}_REFRESH`);
      if(!_accessToken || !_refreshToken || !_user){ onSignout(); return () => {}; }

      try {
        _user = CryptoJS.AES.decrypt(_user, TOKEN_KEY).toString(CryptoJS.enc.Utf8);
        _user = new UserModel(_user? JSON.parse(_user): {});
        _accessToken = CryptoJS.AES.decrypt(_accessToken, TOKEN_KEY).toString(CryptoJS.enc.Utf8);
        _refreshToken = CryptoJS.AES.decrypt(_refreshToken, REFRESH_KEY).toString(CryptoJS.enc.Utf8);

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