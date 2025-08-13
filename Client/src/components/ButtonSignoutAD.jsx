import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';

import { MenuItem } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { APP_URL } from '@/actions/variables';
import { useMsal } from '@azure/msal-react';
import { makeRequest } from '@/helpers/api';
import { alertChange } from '@/helpers/alert';

export default function ButtonSignoutAD({ msalApplication, tenant, app, test=false, ...props }) {
  const { accessToken, onSignout } = useContext(AuthContext);
  const { instance } = useMsal();

  const signoutProcess = async (e) => {
    e.preventDefault();
    instance.logoutRedirect({ postLogoutRedirectUri: APP_URL, onRedirectNavigate: (_) => false });
    try {
      await makeRequest('POST', '/api/signout', {}, accessToken);
    } catch {}
    onSignout();
    document.cookie = 'msal.interaction.status=;';
    alertChange('Success', 'ออกจากระบบสำเร็จ');
  }

  return (
    <MenuItem onClick={signoutProcess} className="default-p pr-5">
      <LogoutRoundedIcon fontSize="small" className="mr-3" />
      <span className="p pt-1 pb-1">ออกจากระบบ</span>
    </MenuItem>
  );
}