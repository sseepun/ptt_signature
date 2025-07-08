import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

import { Button } from '@mui/material';

export default function SigninPage() {
  const { onSignin } = useContext(AuthContext);

  const clickSignin = (e=null) => {
    e?.preventDefault();
    onSignin({
      _id: 1,
      role: { _id: 1, name: 'Admin', level: 98 },
      firstname: 'PTT',
      lastname: 'Employee',
      username: 'ptt_employee',
      email: 'employee@ptt.co.th',
      avatar: '/img/avatar/01.png',
      status: 1,
    }, 'ACCESS_TOKEN', 'REFRESH_TOKEN');
  }

  return (
    <section className="auth-01 section-padding">
      <div className="img-bg" style={{ backgroundImage: `url('/img/bg/01.jpg')` }}></div>
      <div className="container">
        <div className="auth-container bradius box-shadow">
          <div className="header">
            <img className="logo" src="/logo.png" alt="Logo" />
            <div className="text">
              E-Mail Signature
            </div>
          </div>
          <div className="body text-center">
            <Button onClick={clickSignin} 
              variant="contained" color="primary" fullWidth disableElevation 
              size="large" className="bradius tt-unset" style={{ maxWidth: '18rem' }} 
            >
              <span className="h6">เข้าสู่ระบบ</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}