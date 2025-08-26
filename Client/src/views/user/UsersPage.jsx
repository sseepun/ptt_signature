
import { useState, useEffect, useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { formatDate, formatTime } from '@/helpers/utility';

import {
  Button, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIconIcon from '@mui/icons-material/Delete';

import { makeRequest } from '@/helpers/api';
import { alertChange } from '@/helpers/alert';
import { UserModel } from '@/models';

export default function UsersPage() {
  const { user, accessToken } = useContext(AuthContext);

  const [dataTable, setDataTable] = useState([]);
  const onLoadData = async (e=null) => {
    e?.preventDefault();
    const _fetch = await makeRequest('GET', '/api/user-admins', {}, accessToken);
    const _data = await _fetch.json();
    setDataTable((_data || []).map(d => new UserModel(d)));
  };

  const [employeeCode, setEmployeeCode] = useState('');
  const [employee, setEmployee] = useState(new UserModel());

  const [data, setData] = useState(new UserModel());
  const [process, setProcess] = useState('');
  const onProcess = (e=null, p='', d=null) => {
    e?.preventDefault();
    if(p){
      if(d) setData(new UserModel(d));
      return setProcess(p);
    }
    setEmployeeCode('');
    setEmployee(new UserModel());
    return setProcess('');
  }

  const onSubmit = async (e=null) => {
    e?.preventDefault();
    if(process === 'create' && employeeCode){
      const _fetch = await makeRequest('GET', `/api/user/${employeeCode}`, {}, accessToken);
      if(!_fetch.ok || _fetch.status !== 200) return alertChange('Danger', 'ไม่พบผู้ใช้ในระบบ PIS');
      const _data = await _fetch.json();
      setEmployee(new UserModel(_data));
      return setProcess('create-2');
    }
    if(process === 'create-2' && employee?.EmployeeId){
      const _fetch = await makeRequest('POST', '/api/user-admin',
        { EmployeeId: employee.EmployeeId }, accessToken);
      if(!_fetch.ok || _fetch.status !== 200) return alertChange('Danger', 'เพิ่มสิทธิ์ผู้ใช้ไม่สำเร็จ');
      alertChange('Success', 'เพิ่มสิทธิ์ผู้ใช้สำเร็จ');
      onLoadData();
      return onProcess();
    }
    if(process === 'delete' && data?.Id){
      const _fetch = await makeRequest('DELETE', `/api/user-admin/${data.Id}`, {}, accessToken);
      if(!_fetch.ok || _fetch.status !== 200) return alertChange('Danger', 'ลบสิทธิ์ผู้ใช้ไม่สำเร็จ');
      alertChange('Success', 'ลบสิทธิ์ผู้ใช้สำเร็จ');
      onLoadData();
      return onProcess();
    }
  }

  useEffect(() => { if(accessToken) onLoadData(); }, [accessToken]);

  return (<>
    <section className="section-padding">
      <div className="container">
        <div className="ss-box lg">
          <div className="d-flex ai-center jc-space-between">
            <h4 className="fw-600 mr-4">
              จัดการสิทธิ์ผู้ใช้
            </h4>
            <Button onClick={e => onProcess(e, 'create')} 
              variant="contained" color="secondary" disableElevation 
              className="bradius" startIcon={<AddIcon fontSize="large" />} 
            >
              เพิ่มสิทธิ์
            </Button>
          </div>
          <div className="table-wrapper mt-6">
            <table className="table">
              <thead>
                <tr>
                  <th className="fw-600 text-center" style={{ minWidth: 65 }}>
                    <p className="fw-600">#</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 240, width: '60%' }}>
                    <p className="fw-600">ชื่อ-นามสกุล</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 220, width: '40%'}}>
                    <p className="fw-600">ส่วนงาน</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 165 }}>
                    <p className="fw-600">ใช้งานล่าสุด</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 80 }}>
                    <p className="fw-600">ลบสิทธิ์</p>
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
                        <td>
                          <p className="text-center">{i + 1}</p>
                        </td>
                        <td>
                          <p>{d.displayName()}</p>
                          <p className="sm color-sgray">
                            อีเมล: {d.Email}
                          </p>
                        </td>
                        <td>
                          <p>{d.Department}</p>
                          <p className="sm color-sgray">
                            ตำแหน่ง : {d.Title}
                          </p>
                        </td>
                        <td className="text-center">
                          <p>{formatDate(d.UpdatedAt)} {formatTime(d.UpdatedAt)}</p>
                        </td>
                        <td className="text-center">
                          <IconButton onClick={e => onProcess(e, 'delete', d)} 
                            color="error" disabled={user.Id === d.Id} 
                          >
                            <DeleteIconIcon />
                          </IconButton>
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

    <Dialog open={process==='create'} onClose={() => onProcess()} 
      fullWidth={true} maxWidth="xs" scroll="paper" 
    >
      <form onSubmit={onSubmit}>
        <DialogTitle component="div" className="p-0">
          <div className="dialog-header">
            <h5 className="fw-600 lh-xs">
              เพิ่มสิทธิ์ผู้ใช้
            </h5>
            <div className="btn-close" onClick={onProcess}>
              <div className="hamburger active">
                <div /><div /><div />
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={true}>
          <TextField label="รหัสพนักงาน" required fullWidth variant="outlined" 
            value={employeeCode} onChange={e => setEmployeeCode(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
          <div className="btns mt-0">
            <Button type="submit" disabled={!employeeCode} 
              variant="contained" color="secondary" disableElevation 
              size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
            >
              <span className="h6">ค้นหา</span>
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
    <Dialog open={process==='create-2'} onClose={() => onProcess()} 
      fullWidth={true} maxWidth="md" scroll="paper" 
    >
      <form onSubmit={onSubmit}>
        <DialogTitle component="div" className="p-0">
          <div className="dialog-header">
            <h5 className="fw-600 lh-xs">
              เพิ่มสิทธิ์ผู้ใช้
            </h5>
            <div className="btn-close" onClick={onProcess}>
              <div className="hamburger active">
                <div /><div /><div />
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={true}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="fw-600 text-center" style={{ minWidth: 65 }}>
                    <p className="fw-600">#</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 240, width: '60%' }}>
                    <p className="fw-600">ชื่อ-นามสกุล</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 220, width: '40%'}}>
                    <p className="fw-600">ส่วนงาน</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <p className="text-center">1</p>
                  </td>
                  <td>
                    <p>{employee.displayName()}</p>
                    <p className="sm color-sgray">
                      อีเมล: {employee.Email}
                    </p>
                  </td>
                  <td>
                    <p>{employee.Department}</p>
                    <p className="sm color-sgray">
                      ตำแหน่ง : {employee.Title}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="btns mt-0">
            <Button type="submit" 
              variant="contained" color="secondary" disableElevation 
              size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
            >
              <span className="h6">เพิ่มสิทธิ์</span>
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>

    <Dialog open={process==='delete'} onClose={() => onProcess()} 
      fullWidth={true} maxWidth="xs" scroll="paper" 
    >
      <form onSubmit={onSubmit}>
        <DialogTitle component="div" className="p-0">
          <div className="dialog-header">
            <h5 className="fw-600 text-center lh-xs">
              ยืนยันการลบสิทธิ์ผู้ใช้
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