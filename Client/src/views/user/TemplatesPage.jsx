
import { useState, useEffect, useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '@/helpers/utility';

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { makeRequest } from '@/helpers/api';
import { alertChange } from '@/helpers/alert';
import { EmailTemplateModel } from '@/models';

export default function TemplatesPage() {
  const { accessToken } = useContext(AuthContext);

  const [dataTable, setDataTable] = useState([]);
  const onLoadData = async (e=null) => {
    e?.preventDefault();
    const _fetch = await makeRequest('GET', '/api/email-templates', {}, accessToken);
    const _data = await _fetch.json();
    setDataTable((_data || []).map(d => new EmailTemplateModel(d)));
  };

  const [data, setData] = useState(new EmailTemplateModel());
  const [process, setProcess] = useState('');
  const onProcess = (e=null, p='', d=null) => {
    e?.preventDefault();
    if(p){
      setData(new EmailTemplateModel(d || {}));
      return setProcess(p);
    }
    return setProcess('');
  };
  const onSubmit = async (e=null) => {
    e?.preventDefault();
    if(process !== 'delete' || !data.Id) return;
    const _fetch = await makeRequest('DELETE', `/api/email-template/${data.Id}`, {}, accessToken);
    if(!_fetch.ok || _fetch.status !== 200) return alertChange('Danger', 'ลบ Template ไม่สำเร็จ');
    alertChange('Success', 'ลบ Template สำเร็จ');
    onLoadData();
    return onProcess();
  };

  useEffect(() => { if(accessToken) onLoadData(); }, [accessToken]);

  return (<>
    <section className="section-padding">
      <div className="container">
        <div className="ss-box lg">
          <div className="d-flex ai-center jc-space-between">
            <h4 className="fw-600 mr-4">
              จัดการ Template
            </h4>
            <Button component={Link} to="/backend/template/create" 
              variant="contained" color="secondary" disableElevation 
              className="bradius" startIcon={<AddIcon fontSize="large" />} 
            >
              เพิ่ม
            </Button>
          </div>
          <div className="table-wrapper mt-6">
            <table className="table">
              <thead>
                <tr>
                  <th className="fw-600 text-center" style={{ minWidth: 65 }}>
                    <p className="fw-600">#</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 240, width: '100%' }}>
                    <p className="fw-600">ชื่อ Template</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 175 }}>
                    <p className="fw-600">แก้ไขล่าสุด</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 130 }}>
                    <p className="fw-600">สถานะ</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 140 }}>
                    <p className="fw-600">การจัดการ</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!dataTable.length? (
                  <tr><td colSpan={5} className="text-center">
                    <p className="pt-2 pb-2">ไม่พบข้อมูล</p>  
                  </td></tr>
                ): (
                  dataTable.map((d, i) => {
                    return (
                      <tr key={i}>
                        <td className="text-center">
                          <p>{i + 1}</p>
                        </td>
                        <td>
                          <Link to={`/backend/template/view/${d.Id}`} className="p h-color-p">
                            {d.Name}
                          </Link>
                        </td>
                        <td className="text-center">
                          <p>{formatDate(d.UpdatedAt)} {formatTime(d.UpdatedAt)}</p>
                        </td>
                        <td className="text-center">
                          {d.displayStatus()}
                        </td>
                        <td className="text-center">
                          <Button component={Link} to={`/backend/template/view/${d.Id}`} 
                            variant="contained" color="success" disableElevation size="small" 
                            className="bradius tt-unset p-0 mr-1" style={{ minWidth: 32, minHeight: 32 }} 
                          >
                            <VisibilityIcon fontSize="small" />
                          </Button>
                          <Button component={Link} to={`/backend/template/update/${d.Id}`} 
                            variant="contained" color="warning" disableElevation size="small" 
                            className="bradius tt-unset p-0 mr-1" style={{ minWidth: 32, minHeight: 32 }} 
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button onClick={e => onProcess(e, 'delete', d)} 
                            disabled={d.Status === 1} 
                            variant="contained" color="error" disableElevation size="small" 
                            className="bradius tt-unset p-0" style={{ minWidth: 32, minHeight: 32 }} 
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <Dialog open={process==='delete'} onClose={() => onProcess()} 
      fullWidth={true} maxWidth="xs" scroll="paper" 
    >
      <form onSubmit={onSubmit}>
        <DialogTitle component="div" className="p-0">
          <div className="dialog-header">
            <h5 className="fw-600 text-center lh-xs">
              ยืนยันการลบ Template
            </h5>
            <div className="btn-close" onClick={onProcess}>
              <div className="hamburger active">
                <div /><div /><div />
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={true} className="p-0 border-top-0"></DialogContent>
        <DialogActions>
          <div className="btns d-flex jc-center mt-0">
            <Button type="submit" 
              variant="contained" color="error" disableElevation 
              size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
            >
              <span className="h6">ยืนยัน</span>
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  </>)
}