import { useContext, useMemo, Fragment } from 'react';
import ConfigContext from '@/context/ConfigContext';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { AzureMsalCreateConfig } from '@/helpers/azure';
import ButtonAD from '@/components/ButtonAD';

export const RenderButtonAzureAD = (msalApplication=null, tenant=null, app=null, test=false) => {
  return !msalApplication || !tenant || !app? (<></>): (
    tenant.b2c === 'N'? (
      <MsalProvider instance={msalApplication}>
        <div className="d-flex jc-center mt-2">
          <ButtonAD msalApplication={msalApplication} tenant={tenant} app={app} test={test} />
        </div>
      </MsalProvider>
    ): (<></>)
  );
}

export default function SigninPage() {
  const { isValid, tenants } = useContext(ConfigContext)
  const msalInstances = useMemo(() => {
    if(!isValid || !tenants.length) return {};
    let _res = {};
    tenants.forEach(tenant => {
      const _apps = tenant.apps;
      if(_apps?.length){
        _apps.forEach(app => {
          const _msalConfig = AzureMsalCreateConfig(tenant, app);
          _res = {
            ..._res,
            [app.client_id]: new PublicClientApplication(_msalConfig),
          };
        });
      }
    });
    return _res;
  }, [isValid, tenants])

  return !Object.keys(msalInstances).length? (<></>): (
    <section className="auth-01 section-padding">
      <div className="img-bg" style={{ backgroundImage: `url('/img/bg/01.jpg')` }}></div>
      <div className="container">
        <div className="auth-container bradius box-shadow">
          <div className="header">
            <img className="logo" src="/logo.png" alt="Logo" />
            <div className="text">
              E-mail Signature
            </div>
          </div>
          <div className="body text-center">
            {tenants.map((tenant, i) => {
              const apps = tenant.apps;
              return (
                <Fragment key={`tenant_${i}`}>
                  {apps?.length? (
                    apps.map((app, j) => (
                      <Fragment key={`tenant_${i}_${j}`}>
                        {RenderButtonAzureAD(msalInstances[app.client_id], tenant, app)}
                      </Fragment>
                    ))
                  ): (<></>)}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}