import { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from '@/context/AuthContext';

import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import { makeRequest } from '@/helpers/api';
import Template01 from '@/templates/Template01';
import Template02 from '@/templates/Template02';
import Template03 from '@/templates/Template03';
import Template04 from '@/templates/Template04';
import { EmailTemplateModel } from '@/models';

import html2canvas from 'html2canvas';

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [template, setTemplate] = useState(new EmailTemplateModel());

  const onLoadData = async (_user) => {
    try {
      const _fetch = await makeRequest('GET', `/email-template-active`);
      if(_fetch.ok && _fetch.status === 200){
        const _data = await _fetch.json();
        setTemplate(new EmailTemplateModel(_data));
      }
    } catch {}
  };

  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const updateSize = () => {
      const _width = ref?.current?.offsetWidth || 0;
      setScale(() => Math.round((_width? _width/1266: 1) *100)/100);
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [ref, template.Id]);

  useEffect(() => { if(user?.Id) onLoadData(); }, [user?.Id]);

  const onDownload = async (e=null) => {
    e?.preventDefault();
    if(!ref?.current) return;

    const _canvas = await html2canvas(ref.current);
    const _dataURL = _canvas.toDataURL('image/png');
    const _link = document.createElement('a');
    _link.href = _dataURL;
    _link.download = 'ptt-email-signature.png';
    _link.click();
  };
    
  return !template.isValid()? (<></>): (
    <section className="section-padding">
      <div className="container">
        <h5 className="pb-2">
          คุณสามารถดาวน์โหลด E-Mail Signature ของคุณได้ที่นี่
        </h5>
        <div ref={ref} className="templates border-1 bcolor-fgray mt-6" style={{ '--scale': scale }}>
          {template.Blocks.map((d, i) => (
            <div key={`block_${i}`}>
              {d.Type === 1? (
                <Template01 data={d?.Data} disabled={false} user={user} />
              ): d.Type === 2? (
                <Template02 data={d?.Data} disabled={true} user={user} />
              ): d.Type === 3? (
                <Template03 data={d?.Data} disabled={true} user={user} />
              ): d.Type === 4? (
                <Template04 data={d?.Data} disabled={true} user={user} />
              ): (<></>)}
            </div>
          ))}
        </div>
        <div className="mt-6 pt-1">
          <Button onClick={onDownload} 
            variant="contained" color="secondary" fullWidth disableElevation 
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