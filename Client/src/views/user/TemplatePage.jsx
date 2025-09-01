
import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';

import {
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControlLabel, Switch, Chip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';

import { makeRequest } from '@/helpers/api';
import { alertChange } from '@/helpers/alert';
import Template01 from '@/templates/Template01';
import Template02 from '@/templates/Template02';
import Template03 from '@/templates/Template03';
import Template04 from '@/templates/Template04';
import { EmailTemplateModel } from '@/models';

const availableBlocks = [
  new EmailTemplateModel().getBlock({ Type: 1, Name: 'Block 1', Image: '/img/template/01.jpg' }),
  new EmailTemplateModel().getBlock({ Type: 2, Name: 'Block 2', Image: '/img/template/02.jpg' }),
  new EmailTemplateModel().getBlock({ Type: 3, Name: 'Block 3', Image: '/img/template/03.jpg' }),
  new EmailTemplateModel().getBlock({ Type: 4, Name: 'Block 4', Image: '/img/template/04.jpg' }),
];

export default function TemplatePage() {
  const { accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const history = useNavigate();
  const params = useParams();
  const crud = params.crud || 'create';
  const dataId = params['*'] || null;

  const disabled = useMemo(() => ['view'].indexOf(crud) > -1, [crud]);
  const [disabledStatus, setDisabledStatus] = useState(false);

  const [template, setTemplate] = useState(new EmailTemplateModel());
  const [blocks, setBlocks] = useState([]);
  const onLoadData = async (_crud, _dataId) => {
    try {
      setDisabledStatus(() => false);
      const _fetchCount = await makeRequest('GET', '/api/email-template-count', {}, accessToken);
      const _count = await _fetchCount.json();

      if(_crud === 'create'){
        if(_count < 1){
          setTemplate(new EmailTemplateModel({ Status: 1 }));
          setDisabledStatus(() => true);
        }
        return setBlocks([ availableBlocks[0], availableBlocks[1] ]);
      }
      if(['view','update'].indexOf(_crud) < 0 || !_dataId) return history('/backend/templates');

      const _fetch = await makeRequest('GET', `/api/email-template/${_dataId}`, {}, accessToken);
      const _data = await _fetch.json();
      const _template = new EmailTemplateModel(_data);
      setTemplate(_template);
      if(_count < 2 || _template.Status) setDisabledStatus(() => true);
      setBlocks(_template.Blocks);
    } catch {
      return history('/backend/templates');
    }
  };

  const [block, setBlock] = useState(null);
  const [process, setProcess] = useState('');
  const onProcess = (e=null, p='') => {
    e?.preventDefault();
    setBlock(null);
    return setProcess(p || '');
  }
  const onSubmitProcess = (e=null) => {
    e?.preventDefault();
    if(!block?.Type) return;
    const _blocks = [ ...blocks ];
    _blocks.push(block);
    setBlocks(_blocks);
    onProcess();
  }

  const [blockIndex, setBlockIndex] = useState(-1);
  const [dataKey, setDataKey] = useState(null);
  const [data, setData] = useState(null);

  const onTemplate = (i=-1, k='', d=null) => {
    console.log(123, i, k, d)
    if(i < 0 || !k || !d) return onTemplateClose();
    setBlockIndex(i);
    setDataKey(k);
    return setData(d);
  }
  const onTemplateClose = (e=null) => {
    e?.preventDefault();
    setBlockIndex(-1);
    setDataKey(null);
    // return setData(null);
    return;
  }

  const onTemplateChange = (key, value) => {
    if(blockIndex < 0 || !dataKey || !key) return;
    setData({ ...data, [key]: value });
  }
  const onTemplateFileChange = async (file) => {
    if(!file) return;

    setLoading(() => true);
    const toDataURL = (url, callback) => {
      let _xhr = new XMLHttpRequest();
      _xhr.onload = () => {
        let _reader = new FileReader();
        _reader.onloadend = () => callback(_reader.result);
        _reader.readAsDataURL(_xhr.response);
      };
      _xhr.open('GET', url);
      _xhr.responseType = 'blob';
      _xhr.send();
    }
    try {
      toDataURL(URL.createObjectURL(file), dataUrl => {
        setData({ ...data, value: dataUrl });
        // setData({ ...data, preview: URL.createObjectURL(file), toUpload: file });
        setLoading(() => false);
      });
    } catch {
      setLoading(() => false);
    }
  }
  const onTemplateDelete = (e=null, i=-1) => {
    e?.preventDefault();
    if(i < 0) return;
    const _blocks = [ ...blocks ];
    if(!_blocks[i]) return;
    _blocks.splice(i, 1);
    setBlocks(_blocks);
  }
  const onTemplateMove = (e=null, i=-1, direction='up') => {
    e?.preventDefault();
    if(i < 0 || blocks.length < 2) return;
    let _blocks = [ ...blocks ];
    if(direction === 'up' && i > 0){
      const temp = _blocks[i - 1];
      _blocks[i - 1] = _blocks[i];
      _blocks[i] = temp;
    }else if(direction === 'down' && i < _blocks.length-1){
      const temp = _blocks[i + 1];
      _blocks[i + 1] = _blocks[i];
      _blocks[i] = temp;
    }
    setBlocks(_blocks);
  }

  const onTemplateSubmit = (e) => {
    e?.preventDefault();
    if(blockIndex < 0 || !dataKey || !data?.type) return;
    if(!blocks[blockIndex]) return;
    let _blocks = [ ...blocks ];
    let _data = _blocks[blockIndex].Data || {};
    _data[dataKey] = { ...data };
    _blocks[blockIndex] = {
      ..._blocks[blockIndex],
      Data: _data,
      Counting: (_blocks[blockIndex].Counting || 0) + 1,
    };
    setBlocks(_blocks);
    onTemplateClose();
  }

  const onSubmit = async (e=null) => {
    e?.preventDefault();
    if(!blocks.length) return;
    const _template = new EmailTemplateModel({
      Id: dataId,
      Name: template.Name,
      Template: JSON.stringify(blocks),
      Status: template.Status,
    });
    if(crud === 'create'){
      setLoading(() => true);
      const _fetch = await makeRequest('POST', '/api/email-template', _template, accessToken);
      if(!_fetch.ok || _fetch.status !== 200) return alertChange('Danger', 'เพิ่ม Template ไม่สำเร็จ');
      setLoading(() => false);
      alertChange('Success', 'เพิ่ม Template สำเร็จ');
      return history('/backend/templates');
    }
    if(crud === 'update'){
      setLoading(() => true);
      const _fetch = await makeRequest('PATCH', '/api/email-template', _template, accessToken);
      if(!_fetch.ok || _fetch.status !== 200) return alertChange('Danger', 'บันทึก Template ไม่สำเร็จ');
      setLoading(() => false);
      alertChange('Success', 'บันทึก Template สำเร็จ');
      return history('/backend/templates');
    }
  }

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
  }, [ref]);

  useEffect(() => { if(accessToken) onLoadData(crud, dataId); }, [crud, dataId, accessToken]);

  return (<>
    <section className="section-padding">
      <div className="container">
        <form onSubmit={onSubmit}>
          <div className="template-header">
            <h4 className="fw-600">
              {crud==='create'? 'เพิ่ม': crud==='update'? 'แก้ไข': 'ดู'} Template
            </h4>
            <div className="form-input hide-mobile">
              <input type="text" required readOnly={crud==='view'} 
                className={`h4 fw-600 ${crud==='view'? 'pe-none': ''}`}  
                value={template.Name || ''} placeholder="ชื่อ Template" 
                onChange={e => setTemplate({ ...template, Name: e.target.value })}
              />
            </div>
            <div className="form-switch">
              <FormControlLabel className="m-0" 
                label={template.Status===1? 'เปิดใช้งาน': 'ปิดใช้งาน'} 
                control={<Switch color="success" 
                  checked={template.Status} disabled={crud==='view' || disabledStatus} 
                  onChange={e => setTemplate({ ...template, Status: e.target.checked? 1: 0 })} 
                />} 
              />
            </div>
            <div className="form-input show-mobile">
              <input type="text" className="h4 fw-600" required 
                value={template.Name || ''} placeholder="ชื่อ Template" 
                onChange={e => setTemplate({ ...template, Name: e.target.value })}
              />
            </div>
          </div>
          <div ref={ref} style={{ '--scale': scale }} 
            className={`templates border-1 mt-6 ${blocks.length? 'bcolor-fgray': ''}`} 
          >
            {blocks.map((d, i) => (
              <div key={`block_${i}_${d.Counting ?? 0}`} className={disabled? '': 'template-editor'}>
                {d.Type === 1? (
                  <Template01 data={d?.Data} disabled={disabled} 
                    onClick={(_key, _data) => onTemplate(i, _key, _data)} 
                  />
                ): d.Type === 2? (
                  <Template02 data={d?.Data} disabled={disabled} 
                    onClick={(_key, _data) => onTemplate(i, _key, _data)} 
                  />
                ): d.Type === 3? (
                  <Template03 data={d?.Data} disabled={disabled} 
                    onClick={(_key, _data) => onTemplate(i, _key, _data)} 
                  />
                ): d.Type === 4? (
                  <Template04 data={d?.Data} disabled={disabled} 
                    onClick={(_key, _data) => onTemplate(i, _key, _data)} 
                  />
                ): (<></>)}
                {disabled? (<></>): (
                  <div className="options">
                    <Button onClick={e => onTemplateMove(e, i, 'up')} 
                      disabled={i === 0 || blocks.length < 2} 
                      variant="contained" color="default" disableElevation 
                      className="bradius tt-unset bradius-0 pl-2 pr-2" style={{ minWidth: 0 }} 
                    >
                      <ArrowUpwardIcon />
                    </Button>
                    <Button onClick={e => onTemplateMove(e, i, 'down')} 
                      disabled={i === blocks.length - 1 || blocks.length < 2} 
                      variant="contained" color="default" disableElevation 
                      className="bradius tt-unset bradius-0 pl-2 pr-2" style={{ minWidth: 0 }} 
                    >
                      <ArrowDownwardIcon />
                    </Button>
                    <Button onClick={e => onTemplateDelete(e, i)} 
                      variant="contained" color="error" disableElevation 
                      className="bradius tt-unset bradius-0 pl-2 pr-2" style={{ minWidth: 0 }} 
                    >
                      <DeleteOutlineIcon />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {disabled || blocks.length > 3? (<></>): (
            <div className="templates">
              <div className="template-add" onClick={e => onProcess(e, 'create')}>
                <div className="wrapper text-center">
                  <AddCircleOutlineIcon style={{ fontSize: '3rem' }} />
                  <p className="lg">เพิ่ม Signature Block</p>
                </div>
              </div>
            </div>
          )}
          <div className="btns pt-6">
            {['create', 'update'].indexOf(crud) > -1? (
              <Button type="submit" disabled={!blocks.length} 
                variant="contained" color="secondary" disableElevation 
                size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
              >
                <span className="h6">{crud==='create'? 'เพิ่ม': 'บันทึก'}</span>
              </Button>
            ): (<></>)}
            <Button component={Link} to="/backend/templates" 
              variant="contained" color="default" disableElevation 
              size="large" className="bradius tt-unset" style={{ minWidth: '7.5rem' }} 
            >
              <span className="h6">ย้อนกลับ</span>
            </Button>
          </div>
        </form>
      </div>
    </section>

    {disabled? (<></>): (<>
      <Dialog open={['create'].indexOf(process) > -1} onClose={() => onProcess()} 
        fullWidth={true} maxWidth="sm" scroll="paper" 
        PaperProps={{ component: 'form', onSubmit: onSubmitProcess }} 
      >
        <DialogTitle component="div" className="p-0">
          <div className="dialog-header">
            <h5 className="fw-600 lh-xs">
              เลือก Signature Block
            </h5>
            <div className="btn-close" onClick={onProcess}>
              <div className="hamburger active">
                <div /><div /><div />
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={true}>
          {availableBlocks.map((d, i) => (
            <div key={`ablock_${i}`} className="mb-2">
              <div className={`template-block ${block?.Type === d.Type? 'active': ''}`} 
                onClick={e => { e.preventDefault(); setBlock(d); }} 
              >
                <p className="lg mb-1">{d.Name}</p>
                <img className="img bradius border-1 bcolor-fgray" src={d.Image} alt="Block" />
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <div className="btns mt-0">
            <Button type="submit" disabled={!block} 
              variant="contained" color="secondary" disableElevation 
              size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
            >
              <span className="h6">เพิ่ม</span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Dialog open={blockIndex > -1 && dataKey? true: false} 
        onClose={() => onTemplateClose()} fullWidth={true} scroll="paper" 
        PaperProps={{ component: 'form', onSubmit: onTemplateSubmit }} 
        maxWidth={['image','background'].indexOf(data?.type) > -1? 'sm': 'md'} 
      >
        <DialogTitle component="div" className="p-0">
          <div className="dialog-header">
            <h5 className="fw-600 lh-xs">
              แก้ไขข้อมูลเทมเพลต
            </h5>
            <div className="btn-close" onClick={onTemplateClose}>
              <div className="hamburger active">
                <div /><div /><div />
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={true} className="with-grids">
          {data?.type === 'text'? (
            <div className="grids">
              <div className="grid sm-60 mt-0">
                <div className="grids">
                  <div className="grid sm-100">
                    <TextField label="ข้อมูล" variant="outlined" 
                      value={data?.value || ''} fullWidth inputProps={{ maxLength: 128 }}  
                      onChange={e => onTemplateChange('value', e.target.value)} 
                    />
                  </div>
                  <div className="grid sm-50">
                    <TextField label="เลือกสี" variant="outlined" type="color" 
                      value={data?.color || ''} fullWidth 
                      onChange={e => onTemplateChange('color', e.target.value)} 
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: 0, margin: '.375rem .375rem .25rem .375rem',
                          height: 46, border: '1px solid #eeeeee',
                        },
                      }} 
                    />
                  </div>
                </div>
              </div>
              <div className="grid sm-40">
                <p>ข้อมูลที่ใส่ได้</p>
                {[
                  'Prefix','PrefixEN','FirstName','FirstNameEN','LastName','LastNameEN',
                  'EmployeeId','Position','PositionEN','Email','Telephone','Mobile',
                  'Department','DepartmentEN','DepartmentAbbr',
                ].map((d, i) => (
                  <Chip key={`chip_${i}`} label={d} className="mt-1 mr-1" 
                    disabled={data?.value?.includes(d)} 
                    size="small" color="primary" onClick={e => {
                      e.preventDefault();
                      onTemplateChange('value', `${(data?.value || '').trim()} [${d}]`.trim())
                    }} 
                  />
                ))}
              </div>
            </div>
          ): ['image','background'].indexOf(data?.type) > -1? (
            <div className="grids">
              <div className="grid sm-100">
                <img className="img border-1 bradius bcolor-fgray" 
                  src={data?.preview || data?.value} alt="Background" 
                />
              </div>
              <div className="grid sm-100 mt-4">
                <Button component="label" variant="contained" color="primary" disableElevation 
                  size="large" className="bradius tt-unset" style={{ minWidth: '7.5rem' }} 
                >
                  <span className="h6">เปลี่ยนภาพ</span>
                  <input type="file" accept=".png,.jpg,.jpeg" hidden 
                    onChange={e => onTemplateFileChange(e.target?.files?.[0])} 
                  />
                </Button>
              </div>
            </div>
          ): (<></>)}
        </DialogContent>
        <DialogActions>
          <div className="btns mt-0">
            <Button type="submit" variant="contained" color="secondary" disableElevation 
              size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
            >
              <span className="h6">บันทึก</span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>)}

    <div className={`global-loader ${loading? 'active': ''}`}>
      <div className="wrapper color-p">
        <CircularProgress color="inherit" size={68} thickness={4} />
      </div>
    </div>
  </>)
}