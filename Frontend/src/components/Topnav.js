import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

import { IconButton, Menu, MenuItem } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

const Topnav = () => {
  const { user, onSignout } = useContext(AuthContext);

  const clickSignout = (e=null) => {
    e?.preventDefault();
    onSignout();
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

  return(<>
    <nav className="topnav">
      <div className="wrapper">
        <Link className="logo" href="/">
          <img src="/logo.png" alt="Logo" />
          <div className="text">
            <div className="top">E-Mail</div>
            <div className="bottom">Signature</div>
          </div>
        </Link>
        {true || user.isAdmin()? (
          <div className="menu-container">
            <div className="menu">
              <Link to="/">หน้าแรก</Link>
            </div>
            <div className="menu">
              <Link to="/templates">อีเมลเทมเพลต</Link>
            </div>
            <div className="menu">
              <Link to="/users">การจัดการผู้ใช้</Link>
            </div>
          </div>
        ): (<></>)}
        <div className="options">
          <div className="option" onClick={e => onPopupOpen(e, 1)}>
            <IconButton className="p-1">
              <div className="avatar" style={{ backgroundImage: `url(${user.avatar})` }}></div>
            </IconButton>
          </div>
          {true || user.isAdmin()? (
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
          <span>ระดับ :</span> {user.role.displayName()}
        </p>
      </div>
      <MenuItem className="default-p pr-5" component={Link} href="/profile">
        <PersonOutlineRoundedIcon fontSize="small" className="mr-3" />
        <span className="p pt-1 pb-1">ข้อมูลส่วนตัว</span>
      </MenuItem>
      <MenuItem onClick={clickSignout} className="default-p pr-5">
        <LogoutRoundedIcon fontSize="small" className="mr-3" />
        <span className="p pt-1 pb-1">ออกจากระบบ</span>
      </MenuItem>
    </Menu>

    {true || user.isAdmin()? (
      <Menu anchorEl={popupAnchor} open={popupActive===2} onClose={onPopupClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
        transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
      >
        <MenuItem className="default-p pr-5" component={Link} href="/">
          <span className="p pt-1 pb-1">หน้าแรก</span>
        </MenuItem>
        <MenuItem className="default-p pr-5" component={Link} href="/templates">
          <span className="p pt-1 pb-1">อีเมลเทมเพลต</span>
        </MenuItem>
        <MenuItem className="default-p pr-5" component={Link} href="/users">
          <span className="p pt-1 pb-1">การจัดการผู้ใช้</span>
        </MenuItem>
      </Menu>
    ): (<></>)}
  </>)
}
export default Topnav;