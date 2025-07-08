
import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

import {
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import DeleteIconIcon from '@mui/icons-material/Delete';

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
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
    }),
    new UserModel({
      firstname: 'มานพ',
      lastname: 'ผ่องโสภา',
      email: 'example@ptt.com',
      department: 'ปก.ผยก',
      position: 'Engineer',
      role: { _id: 1, name: 'Admin', level: 98 },
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
    if(process === 'delete' && data?._id){
      console.log(data);
    }
  }

  return (<>
    <section className="section-padding">
      <div className="container">
        <div className="ss-box lg">
          <h4 className="fw-600">
            จัดการสิทธิ์ผู้ใช้
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

    <Dialog open={['delete'].indexOf(process) > -1} onClose={() => onProcess()} 
      fullWidth={true} maxWidth="xs" scroll="paper" 
      PaperProps={{ component: 'form', onSubmit: onSubmit }} 
    >
      <DialogTitle component="div" className="p-0">
        <div className="dialog-header">
          <h5 className="fw-600 lh-xs">
            ลบสิทธิ์ผู้ใช้
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
        <div className="btns mt-0">
          <Button type="submit" 
            variant="contained" color="error" disableElevation 
            size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
          >
            <span className="h6">ยืนยันการลบ</span>
          </Button>
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