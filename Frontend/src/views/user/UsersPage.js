
import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

import {
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { UserModel } from '../../models';

export default function UsersPage() {
  const { user } = useContext(AuthContext);

  const users = [
    new UserModel({
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
    }),
    new UserModel({
      firstname: 'Paweena',
      lastname: 'Ponsopha',
      email: 'paweena@gmail.com',
      department: 'ปก.ผยก',
      position: 'Ux Engineer',
      role: { _id: 1, name: 'User', level: 1 },
    }),
    new UserModel({
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
    }),
    new UserModel({
      firstname: 'Paweena',
      lastname: 'Ponsopha',
      email: 'paweena@gmail.com',
      department: 'ปก.ผยก',
      position: 'Ux Engineer',
      role: { _id: 1, name: 'User', level: 1 }
    }),
    new UserModel({
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
    }),
    new UserModel({
      firstname: 'Paweena',
      lastname: 'Ponsopha',
      email: 'paweena@gmail.com',
      department: 'ปก.ผยก',
      position: 'Ux Engineer',
      role: { _id: 1, name: 'User', level: 1 }
    }),
  ];

  const [data, setData] = useState(new UserModel());
  const [process, setProcess] = useState('');
  const onProcess = (e=null, p='', d=null) => {
    e?.preventDefault();
    if(p && d){
      setData(new UserModel(d));
      return setProcess(p);
    }
    return setProcess('');
  }

  const onSubmit = (e=null) => {
    e?.preiventDefault();
  }

  return (<>
    <section className="section-padding">
      <div className="container">
        <div className="ss-box lg">
          <h4 className="fw-600">
            การจัดการผู้ใช้
          </h4>

          <div className="table-wrapper mt-6">
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
                  <th className="fw-600 text-center" style={{ minWidth: 140 }}>
                    <p className="fw-600">ระดับ</p>
                  </th>
                  <th className="fw-600 text-center" style={{ minWidth: 100 }}>
                    <p className="fw-600">การกระทำ</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((d, i) => {
                  const _process = user.role.level > d.role.level? 'update': 'view'; 
                  return (
                    <tr key={i}>
                      <td>
                        <div className="table-avatar" 
                          style={{ backgroundImage: `url(${d.avatar})` }} 
                        ></div>
                      </td>
                      <td>
                        <p className="a h-color-p c-pointer" 
                          onClick={e => onProcess(e, _process, d)} 
                        >
                          {d.displayName()}
                        </p>
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
                        {user.role.level > d.role.level? (
                          <IconButton onClick={e => onProcess(e, _process, d)} color="success">
                            <EditSquareIcon />
                          </IconButton>
                        ): (
                          <IconButton onClick={e => onProcess(e, _process, d)} color="info">
                            <VisibilityIcon />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="paginate mt-6">
            <div className="page-set">
              <div className="page disabled">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.72 15.02">
                  <path d="M7.29,8.25l6.6,6.6c.11,.11,.25,.17,.4,.17s.28-.06,.4-.17l.86-.86c.11-.11,.17-.25,.17-.4s-.06-.28-.17-.4l-5.35-5.35L15.52,2.53c.11-.11,.17-.25,.17-.4s-.06-.28-.17-.4l-.86-.86c-.11-.11-.25-.17-.4-.17s-.28,.06-.4,.17L7.29,7.46c-.11,.11-.17,.25-.17,.4,0,.15,.06,.28,.17,.4h0Z" />
                  <path d="M.17,7.55l6.6,6.6c.11,.11,.25,.17,.4,.17s.28-.06,.4-.17l.86-.86c.11-.11,.17-.25,.17-.4s-.06-.28-.17-.4L3.08,7.15,8.41,1.82c.11-.11,.17-.25,.17-.4s-.06-.28-.17-.4l-.86-.86c-.11-.11-.25-.17-.4-.17s-.28,.06-.4,.17L.17,6.75C.06,6.87,0,7,0,7.15c0,.15,.06,.28,.17,.4h0Z" />
                </svg>
              </div>
              <div className="page disabled">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.6 14.32">
                  <path d="M.17,7.55l6.6,6.6c.11,.11,.25,.17,.4,.17s.28-.06,.4-.17l.86-.86c.11-.11,.17-.25,.17-.4s-.06-.28-.17-.4L3.08,7.15,8.41,1.82c.11-.11,.17-.25,.17-.4s-.06-.28-.17-.4l-.86-.86c-.11-.11-.25-.17-.4-.17s-.28,.06-.4,.17L.17,6.75C.06,6.87,0,7,0,7.15c0,.15,.06,.28,.17,.4h0Z" />
                </svg>
              </div>
            </div>
            <div className="page-set">
              <div className="page active">1</div>
              <div className="page">2</div>
              <div className="page">3</div>
              <div className="page">4</div>
            </div>
            <div className="page-set">
              <div className="page">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.6 14.32">
                  <path d="M8.43,6.77L1.82,.17C1.71,.06,1.58,0,1.43,0s-.28,.06-.4,.17L.17,1.03C.06,1.15,0,1.28,0,1.43s.06,.28,.17,.4L5.52,7.17,.19,12.5c-.11,.11-.17,.25-.17,.4s.06,.28,.17,.4l.86,.86c.11,.11,.25,.17,.4,.17s.28-.06,.4-.17l6.58-6.58c.11-.11,.17-.25,.17-.4,0-.15-.06-.28-.17-.4h0Z" />
                </svg>
              </div>
              <div className="page ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.02 14.32">
                  <path d="M8.43,6.77L1.82,.17C1.71,.06,1.58,0,1.43,0s-.28,.06-.4,.17L.17,1.03C.06,1.15,0,1.28,0,1.43s.06,.28,.17,.4L5.52,7.17,.19,12.5c-.11,.11-.17,.25-.17,.4s.06,.28,.17,.4l.86,.86c.11,.11,.25,.17,.4,.17s.28-.06,.4-.17l6.58-6.58c.11-.11,.17-.25,.17-.4,0-.15-.06-.28-.17-.4h0Z" />
                  <path d="M14.84,6.77L8.24,.17C8.13,.06,7.99,0,7.85,0s-.28,.06-.4,.17l-.86,.86c-.11,.11-.17,.25-.17,.4s.06,.28,.17,.4l5.35,5.35-5.33,5.33c-.11,.11-.17,.25-.17,.4s.06,.28,.17,.4l.86,.86c.11,.11,.25,.17,.4,.17s.28-.06,.4-.17l6.58-6.58c.11-.11,.17-.25,.17-.4,0-.15-.06-.28-.17-.4h0Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Dialog open={['view','update'].indexOf(process) > -1} onClose={() => onProcess()} 
      fullWidth={true} maxWidth="sm" scroll="paper" 
      PaperProps={{ component: 'form', onSubmit: onSubmit }} 
    >
      <DialogTitle component="div" className="p-0">
        <div className="dialog-header">
          <h5 className="fw-600 lh-xs">
            {process==='update'? 'แก้ไขข้อมูลพนักงาน': 'ดูข้อมูลพนักงาน'}
          </h5>
          <div className="btn-close" onClick={onProcess}>
            <div className="hamburger active">
              <div /><div /><div />
            </div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent dividers={true} className="with-grids">
        <div className="grids">
          <div className="grid">
            <TextField label="ชื่อจริง" variant="outlined" disabled fullWidth 
              value={data.firstname || ''} onChange={()=>{}} 
            />
          </div>
          <div className="grid">
            <TextField label="นามสกุล" variant="outlined" disabled fullWidth 
              value={data.lastname || ''} onChange={()=>{}} 
            />
          </div>
          <div className="grid">
            <TextField label="รหัสพนักงาน" variant="outlined" disabled fullWidth 
              value={data.employeeId || '11223344'} onChange={()=>{}} 
            />
          </div>
          <div className="grid">
            <TextField label="อีเมล" variant="outlined" disabled fullWidth 
              value={data.email || ''} onChange={()=>{}} 
            />
          </div>
          <div className="grid sm-100">
            <TextField label="แผนก" variant="outlined" disabled fullWidth 
              value={data.department || ''} onChange={()=>{}} 
            />
          </div>
          <div className="grid sm-100">
            <TextField label="ตำแหน่ง" variant="outlined" disabled fullWidth 
              value={data.position || ''} onChange={()=>{}} 
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div className="btns mt-0">
          {process === 'update'? (
            <Button type="submit" 
              variant="contained" color="primary" disableElevation 
              size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
            >
              <span className="h6">แก้ไข</span>
            </Button>
          ): (<></>)}
          <Button onClick={onProcess} 
            variant="contained" color="default" disableElevation 
            size="large" className="bradius tt-unset" style={{ minWidth: '7.5rem' }} 
          >
            <span className="h6">ปิด</span>
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  </>)
}