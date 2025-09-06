import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import { Link } from 'react-router-dom';

import { IconButton, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { useIdleTimer } from 'react-idle-timer';
import { makeRequest } from '@/helpers/api';
import { alertChange } from '@/helpers/alert';
import { Storage } from '@/helpers/storage';
import { APP_PREFIX } from '@/actions/variables';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { AzureMsalCreateConfig } from '@/helpers/azure';
import ButtonSignoutAD from '@/components/ButtonSignoutAD';

export const RenderSignoutAzureAD = (msalApplication=null, tenant=null, app=null, test=false) => {
  return !msalApplication || !tenant || !app? (<></>): (
    tenant.b2c === 'N'? (
      <MsalProvider instance={msalApplication}>
        <ButtonSignoutAD test={test} 
          msalApplication={msalApplication} tenant={tenant} app={app} 
        />
      </MsalProvider>
    ): (<></>)
  );
}

const Topnav = () => {
  const { user, accessToken, onSignout } = useContext(AuthContext);

  const clickSignout = async (e=null, type=0) => {
    e?.preventDefault();
    if(!accessToken) return;
    try {
      await makeRequest('POST', '/api/signout', {}, accessToken);
    } catch {}
    document.cookie = 'msal.interaction.status=;';
    onSignout();
    if(type === 1) alertChange('Warning', 'Session Timeout ออกจากระบบเนื่องจากไม่มีการใช้งาน');
    else alertChange('Success', 'ออกจากระบบสำเร็จ');
  }

  const signoutTime = 1000 *60 *15;
  const onIdle = () => {
    clickSignout(null, 1);
  }
  useIdleTimer({ timeout: signoutTime, onIdle: onIdle });

  const [popupAnchor, setPopupAnchor] = useState(null);
  const [popupActive, setPopupActive] = useState(0);
  const onPopupOpen = (e=null, i) => {
    setPopupAnchor(e?.currentTarget);
    setPopupActive(i);
  }
  const onPopupClose = () => {
    setPopupAnchor(null);
    setPopupActive(0);
  }

  const location = useLocation();
  useEffect(() => { setPopupAnchor(null); setPopupActive(0); }, [location?.pathname]);

  const [tenant, setTenant] = useState(null);
  const [msalApp, setMsalApp] = useState(null);
  const [msalIntance, setMsalInstance] = useState(null);
  useEffect(() => {
    try {
      const _tenant = Storage.getItem(`${APP_PREFIX}_MSAL_TENANT`);
      if(!_tenant) return;

      const _msalApp = Storage.getItem(`${APP_PREFIX}_MSAL_APP`);
      if(!_msalApp) return;

      setTenant(_tenant);
      setMsalApp(_msalApp);

      const _msalConfig = AzureMsalCreateConfig(_tenant, _msalApp);
      const _msalInstance = new PublicClientApplication(_msalConfig);
      setMsalInstance(_msalInstance);
    } catch {}
  }, []);

  return(<>
    <nav className="topnav">
      <div className="wrapper">
        {user.isAdmin()? (
          <div className="menu-container">
            <div className="menu">
              <Link to="/backend">หน้าแรก</Link>
            </div>
            <div className="menu">
              <Link to="/backend/templates">จัดการ Template</Link>
            </div>
            <div className="menu">
              <Link to="/backend/users">จัดการสิทธิ์ผู้ใช้</Link>
            </div>
          </div>
        ): (<></>)}
        <div className="options">
          <div className="option" onClick={e => onPopupOpen(e, 1)}>
            <IconButton className="p-1">
              <SettingsIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </div>
          {user.isAdmin()? (
            <div className="option show-tablet" onClick={e => onPopupOpen(e, 2)}>
              <div className={`hamburger ${popupActive===2 ? 'active' : ''}`}>
                <div /><div /><div />
              </div>
            </div>
          ): (<></>)}
        </div>
      </div>
    </nav>
    <div className="topnav-spacer"></div>

    <Menu anchorEl={popupAnchor} open={popupActive===1} onClose={onPopupClose} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
    >
      <div className="p-4 pt-1 border-bottom-1 bcolor-fgray">
        <p className="ws-nowrap">
          {user.displayName()}
        </p>
        <p className="sm op-70 ws-nowrap">
          <span>ระดับ :</span> {user.displayRole()}
        </p>
      </div>
      {tenant && msalApp && msalIntance? (
        RenderSignoutAzureAD(msalIntance, tenant, msalApp) 
      ): (
        <MenuItem onClick={clickSignout} className="default-p pr-5">
          <LogoutRoundedIcon fontSize="small" className="mr-3" />
          <span className="p pt-1 pb-1">ออกจากระบบ</span>
        </MenuItem>
      )}
    </Menu>

    {user.isAdmin()? (
      <Menu anchorEl={popupAnchor} open={popupActive===2} onClose={onPopupClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
        transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
      >
        <MenuItem className="default-p pr-5" component={Link} to="/backend">
          <span className="p pt-1 pb-1">หน้าแรก</span>
        </MenuItem>
        <MenuItem className="default-p pr-5" component={Link} to="/backend/templates">
          <span className="p pt-1 pb-1">จัดการ Template</span>
        </MenuItem>
        <MenuItem className="default-p pr-5" component={Link} to="/backend/users">
          <span className="p pt-1 pb-1">จัดการสิทธิ์ผู้ใช้</span>
        </MenuItem>
      </Menu>
    ): (<></>)}
  </>)
}
export default Topnav;