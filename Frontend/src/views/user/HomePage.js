import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function HomePage() {
  return (
    <section className="section-padding">
      <div className="container">
        <h5 className="pb-2">
          คุณสามารถดาวน์โหลด E-Mail Signature ของคุณได้ที่นี่
        </h5>
        <div className="border-1 bcolor-fgray mt-6">
          <img className="img" src="/img/template/01.png" alt="Template" />
          <img className="img" src="/img/template/02.png" alt="Template" />
        </div>
        <div className="mt-6 pt-1">
          <Button variant="contained" color="secondary" fullWidth disableElevation 
            size="large" className="bradius tt-unset" style={{ maxWidth: '11rem' }} 
            startIcon={<DownloadIcon fontSize="large" />} 
          >
            <span className="h6">ดาวน์โหลด</span>
          </Button>
        </div>
      </div>
    </section>
  )
}