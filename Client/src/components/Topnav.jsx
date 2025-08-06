import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import { Link } from 'react-router-dom';

import { IconButton, Menu, MenuItem } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { alertChange } from '@/helpers/alert';

const Topnav = () => {
  const { user, onSignout } = useContext(AuthContext);

  const clickSignout = (e=null) => {
    e?.preventDefault();
    onSignout();
    alertChange('Success', 'ออกจากระบบสำเร็จ');
  }

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

  return(<>
    <nav className="topnav">
      <div className="wrapper">
        {user.isAdmin()? (
          <div className="menu-container">
            <div className="menu">
              <Link to="/">หน้าแรก</Link>
            </div>
            <div className="menu">
              <Link to="/templates">จัดการ Template</Link>
            </div>
            <div className="menu">
              <Link to="/users">จัดการสิทธิ์ผู้ใช้</Link>
            </div>
          </div>
        ): (<></>)}
        <div className="options">
          <div className="option" onClick={e => onPopupOpen(e, 1)}>
            <IconButton className="p-1">
              <div className="avatar" style={{ backgroundImage: `url(${user.Avatar})` }}></div>
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
      <MenuItem onClick={clickSignout} className="default-p pr-5">
        <LogoutRoundedIcon fontSize="small" className="mr-3" />
        <span className="p pt-1 pb-1">ออกจากระบบ</span>
      </MenuItem>
    </Menu>

    {user.isAdmin()? (
      <Menu anchorEl={popupAnchor} open={popupActive===2} onClose={onPopupClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
        transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
      >
        <MenuItem className="default-p pr-5" component={Link} to="/">
          <span className="p pt-1 pb-1">หน้าแรก</span>
        </MenuItem>
        <MenuItem className="default-p pr-5" component={Link} to="/templates">
          <span className="p pt-1 pb-1">จัดการ Template</span>
        </MenuItem>
        <MenuItem className="default-p pr-5" component={Link} to="/users">
          <span className="p pt-1 pb-1">จัดการสิทธิ์ผู้ใช้</span>
        </MenuItem>
      </Menu>
    ): (<></>)}
  </>)
}
export default Topnav;