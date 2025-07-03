
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <section className="section-padding">
      <div className="container">
        <div className="ss-box">
          <h4 className="fw-600 lh-sm">
            สวัสดีครับ คุณ <span className="color-p">{user.displayName()}</span>
          </h4>
          <h6 className="pb-3">
            คุณสามารถดาวน์โหลด E-Mail Signature ของคุณได้ที่นี่
          </h6>
          <div className="border-1 bcolor-fgray mt-6">
            <img className="img" src="/img/template/01.png" alt="Template" />
            <img className="img" src="/img/template/02.png" alt="Template" />
          </div>
          <div className="mt-6 pt-1">
            <Button variant="contained" color="primary" fullWidth disableElevation 
              size="large" className="bradius tt-unset" style={{ maxWidth: '11rem' }} 
              startIcon={<DownloadIcon fontSize="large" />} 
            >
              <span className="h6">ดาวน์โหลด</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}