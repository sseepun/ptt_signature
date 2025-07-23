import { createContext, useState, useEffect } from 'react';
import { UserModel } from '@/models';

import CryptoJS from 'crypto-js';
import { API_URL, APP_PREFIX, TOKEN_KEY, REFRESH_KEY } from '@/actions/variables';

const AuthContext = createContext({
  status: 'loading',
  user: new UserModel(),
  isSignedIn: false,

  onSignin: () => {},
  onSignout: () => {},

  onUpdate: () => {},
});

export const AuthContextProvider = (props) => {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(new UserModel());

  const onSignin = async (u, aToken, rToken) => {
    try {
      if(u && aToken && rToken){
        const _user = new UserModel(u? u: {});
        if(_user.isSignedIn()){
          const _u = CryptoJS.AES.encrypt(JSON.stringify(_user), TOKEN_KEY).toString();
          const _accessToken = CryptoJS.AES.encrypt(aToken, TOKEN_KEY).toString();
          const _refreshToken = CryptoJS.AES.encrypt(rToken, REFRESH_KEY).toString();
          
          localStorage.setItem(`${APP_PREFIX}_USER`, _u);
          localStorage.setItem(`${APP_PREFIX}_ACCESS`, _accessToken);
          localStorage.setItem(`${APP_PREFIX}_REFRESH`, _refreshToken);

          setStatus('authenticated');
          setUser(_user);
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
    localStorage.removeItem(`${APP_PREFIX}_USER`);
    localStorage.removeItem(`${APP_PREFIX}_ACCESS`);
    localStorage.removeItem(`${APP_PREFIX}_REFRESH`);
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
      localStorage.setItem(`${APP_PREFIX}_USER`, CryptoJS.AES.encrypt(JSON.stringify(_newUser), TOKEN_KEY).toString());
    }
    return true;
  }

  /* eslint-disable */
  useEffect(() => {
    const onLoad = async () => {
      if(status !== 'loading') return () => {};
      try {
        let _user = localStorage.getItem(`${APP_PREFIX}_USER`);
        let _accessToken = localStorage.getItem(`${APP_PREFIX}_ACCESS`);
        let _refreshToken = localStorage.getItem(`${APP_PREFIX}_REFRESH`);
        if(_user && _accessToken && _refreshToken){
          _user = CryptoJS.AES.decrypt(_user, TOKEN_KEY).toString(CryptoJS.enc.Utf8);
          _user = new UserModel(_user? JSON.parse(_user): {});
          _accessToken = CryptoJS.AES.decrypt(_accessToken, TOKEN_KEY).toString(CryptoJS.enc.Utf8);
          _refreshToken = CryptoJS.AES.decrypt(_refreshToken, REFRESH_KEY).toString(CryptoJS.enc.Utf8);
          
          // By Pass
          await onSignin(_user, _accessToken, _refreshToken);
          return () => {};

          const _fetch = await fetch(`${API_URL}auth/refresh`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: _refreshToken }),
          });
          if(_fetch.ok && _fetch.status === 200){
            const _data = await _fetch.json();
            if(_data?.data?.user){
              await onSignin(_data.data.user, _data.data.accessToken, _data.data.refreshToken);
              return () => {};
            }
          }
        }
      } catch {}

      onSignout();
      return () => {};
    }
    onLoad();
  }, [])
  /* eslint-enable */

  return (
    <AuthContext.Provider 
      value={{
        status: status,
        user: user,
        isSignedIn: user.isSignedIn() && status === 'authenticated',

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