
import { useState } from 'react';

import {
  Button, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIconIcon from '@mui/icons-material/Delete';

import { UserModel } from '../../models';

export default function UsersPage() {
  const [users, setUsers] = useState([
    new UserModel({
      _id: 1,
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
    }),
    new UserModel({
      _id: 2,
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
    }),
    new UserModel({
      _id: 3,
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
    }),
  ]);

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

  const onSubmit = (e=null) => {
    e?.preventDefault();
    if(process === 'create' && employeeCode){
      setEmployee(users[0]);
      setProcess('create-2');
    }else if(process === 'create-2' && employee?._id){
      const _users = [ ...users ];
      _users.push(employee);
      setUsers(_users);
      onProcess();
    }else if(process === 'delete' && data?._id){
      console.log(data);
    }
  }

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
              startIcon={<AddIcon fontSize="large" />} 
            >
              เพิ่มสิทธิ์
            </Button>
          </div>
          <div className="table-wrapper mt-6">
            <table className="table">
              <thead>
                <tr>
                  <th className="fw-600 text-center" style={{ minWidth: 90 }}>
                    <p className="fw-600">รูปโปรไฟล์</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 240, width: '60%' }}>
                    <p className="fw-600">ชื่อ-นามสกุล</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 220, width: '40%'}}>
                    <p className="fw-600">ส่วนงาน</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 140 }}>
                    <p className="fw-600">ระดับ</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 80 }}>
                    <p className="fw-600">ลบสิทธิ์</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <div className="table-avatar" 
                          style={{ backgroundImage: `url(${d.avatar})` }} 
                        ></div>
                      </td>
                      <td>
                        <p>{d.displayName()}</p>
                        <p className="sm color-sgray">
                          อีเมล: {d.email}
                        </p>
                      </td>
                      <td>
                        <p>{d.department}</p>
                        <p className="sm color-sgray">
                          ตำแหน่ง : {d.position}
                        </p>
                      </td>
                      <td className="text-center">
                        <p>{d.role.displayName()}</p>
                      </td>
                      <td className="text-center">
                        <IconButton onClick={e => onProcess(e, 'delete', d)} color="error">
                          <DeleteIconIcon />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
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
          <TextField label="รหัสผนักงาน" required fullWidth variant="outlined" 
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
                  <th className="fw-600 text-center" style={{ minWidth: 90 }}>
                    <p className="fw-600">รุปโปรไฟล์</p>
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
                    <div className="table-avatar" 
                      style={{ backgroundImage: `url(${employee.avatar})` }} 
                    ></div>
                  </td>
                  <td>
                    <p className="a h-color-p c-pointer">
                      {employee.displayName()}
                    </p>
                    <p className="sm color-sgray">
                      อีเมล: {employee.email}
                    </p>
                  </td>
                  <td>
                    <p>{employee.department}</p>
                    <p className="sm color-sgray">
                      ตำแหน่ง : {employee.position}
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