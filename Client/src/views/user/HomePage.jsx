import { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from '@/context/AuthContext';

import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CircularProgress from '@mui/material/CircularProgress';

import { makeRequest } from '@/helpers/api';
import Template01 from '@/templates/Template01';
import Template02 from '@/templates/Template02';
import Template03 from '@/templates/Template03';
import Template04 from '@/templates/Template04';
import { EmailTemplateModel, UserModel } from '@/models';

import html2canvas from 'html2canvas';

export default function HomePage() {
  const { accessToken, onSignout } = useContext(AuthContext);
  const [template, setTemplate] = useState(new EmailTemplateModel());
  const [user, setUser] = useState(new UserModel());

  const onLoadData = async () => {
    await Promise.all([
      makeRequest('GET', `/api/email-template-active`, {}, accessToken)
        .then(async res => {
          if(res.ok && res.status === 200){
            const data = await res.json();
            return setTemplate(new EmailTemplateModel(data));
          }
        }).catch(() => {}),
      makeRequest('GET', `/api/user-info`, {}, accessToken)
        .then(async res => {
          if(res.ok && res.status === 200){
            const data = await res.json();
            return setUser(new UserModel(data));
          }
          return onSignout();
        }).catch(() => onSignout()),
    ]);
  };

  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const [textWrap, setTextWrap] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      const _width = ref?.current?.offsetWidth || 0;
      const _scale = Math.round((_width? _width/1266: 1) *100)/100;
      setScale(() => _scale);
      if(ref?.current){
        if(ref.current.scrollWidth - 32*_scale > ref.current.offsetWidth) setTextWrap(() => true);
        else setTextWrap(() => false);
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [ref, template.Id, user.Id]);

  useEffect(() => { if(accessToken) onLoadData(); }, [accessToken]);

  const downloadRef = useRef(null);
  const onDownload = async (e=null) => {
    e?.preventDefault();
    if(!downloadRef?.current) return;

    const _canvas = await html2canvas(downloadRef.current);
    const _dataURL = _canvas.toDataURL('image/png');
    const _link = document.createElement('a');
    _link.href = _dataURL;
    _link.download = 'ptt-email-signature.png';
    _link.click();
  };
    
  return (<>
    {!template.isValid() || !user.Id? (<></>): (
      <section className="section-padding">
        <div className="container">
          <h5 className="pb-2">
            คุณสามารถดาวน์โหลด E-Mail Signature ของคุณได้ที่นี่
          </h5>
          <div ref={ref} className="templates border-1 bcolor-fgray mt-6" style={{ '--scale': scale }}>
            <div ref={downloadRef}>
              {template.Blocks.map((d, i) => (
                <div key={`block_${i}`}>
                  {d.Type === 1? (
                    <Template01 data={d?.Data} disabled={true} user={user} textWrap={textWrap} />
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
    )}

    <div className={`global-loader bg-transparent pe-none ${!template.isValid() || !user.Id? 'active': ''}`}>
      <div className="wrapper color-p">
        <CircularProgress color="inherit" size={68} thickness={4} />
      </div>
    </div>
  </>)
}