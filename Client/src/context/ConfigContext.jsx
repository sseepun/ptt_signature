import { createContext, useState, useEffect } from 'react';
import { makeRequest } from '@/helpers/api';

const ConfigContext = createContext({
  isValid: false,
  tenants: [],
});

export const ConfigContextProvider = (props) => {
  const [isValid, setValid] = useState(false);
  const [tenants, setTenants] = useState(null);

  /* eslint-disable */
  useEffect(() => {
    const onLoad = async () => {
      try {
        const _fetch = await makeRequest('GET', '/app-setting');
        const _data = await _fetch.json();
        const _tenants = _data?.CaaConfig?.tenants || [];
        if(_tenants.length){
          setValid(true);
          setTenants(_tenants);
        }
      } catch {}
    }
    onLoad();
  }, []);
  /* eslint-enable */

  return (
    <ConfigContext.Provider 
      value={{
        isValid: isValid,
        tenants: tenants,
      }} 
    >
      {props.children}
    </ConfigContext.Provider>
  );
}
export default ConfigContext