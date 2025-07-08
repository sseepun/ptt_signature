
import { useState, useEffect, useRef } from 'react';

import {
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Template01 from '../../templates/Template01';
import Template02 from '../../templates/Template02';

export default function TemplatesPage() {
  const [blocks, setBlocks] = useState([
    { _id: 1, name: 'Block 1', type: 1, image: '/img/template/01.png' },
    { _id: 2, name: 'Block 2', type: 2, image: '/img/template/02.png' },
  ]);

  const availableBlocks = [
    { _id: 1, name: 'Block 1', type: 1, image: '/img/template/01.png' },
    { _id: 2, name: 'Block 2', type: 2, image: '/img/template/02.png' },
  ];

  const [block, setBlock] = useState(null);
  const [process, setProcess] = useState('');
  const onProcess = (e=null, p='') => {
    e?.preventDefault();
    setBlock(null);
    return setProcess(p || '');
  }

  const onSubmit = (e=null) => {
    e?.preventDefault();
    if(!block?._id) return;
    const _blocks = [ ...blocks ];
    _blocks.push(block);
    setBlocks(_blocks);
    onProcess();
  }

  const [blockIndex, setBlockIndex] = useState(-1);
  const [dataKey, setDataKey] = useState(null);
  const [data, setData] = useState(null);

  const onTemplate = (i=-1, k='', d=null) => {
    if(i < 0 || !k || !d) return onTemplateClose();
    setBlockIndex(i);
    setDataKey(k);
    return setData(d);
  }
  const onTemplateClose = (e=null) => {
    e?.preventDefault();
    setBlockIndex(-1);
    setDataKey(null);
    return setData(null);
  }

  const onTemplateChange = (key, value) => {
    if(blockIndex < 0 || !dataKey || !key) return;
    setData({ ...data, [key]: value });
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
    let _data = _blocks[blockIndex].data || {};
    _data[dataKey] = { ...data };
    _blocks[blockIndex] = {
      ..._blocks[blockIndex],
      data: _data,
      counting: (_blocks[blockIndex].counting || 0) + 1,
    };
    setBlocks(_blocks);
    onTemplateClose();
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

  return (<>
    <section className="section-padding">
      <div className="container">
        <h4 className="fw-600">
          แก้ไข Template
        </h4>
        <div ref={ref} className="templates mt-6" style={{ '--scale': scale }}>
          {blocks.map((d, i) => (
            <div key={`block_${i}_${d.counting ?? 0}`} 
              className="template-editor border-1 bcolor-fgray mb-2" 
            >
              {d.type === 1? (
                <Template01 data={d?.data} 
                  onClick={(_key, _data) => onTemplate(i, _key, _data)} 
                />
              ): d.type === 2? (
                <Template02 data={d?.data} 
                  onClick={(_key, _data) => onTemplate(i, _key, _data)} 
                />
              ): (<></>)}
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
            </div>
          ))}
        
          <div className="template-add" onClick={e => onProcess(e, 'create')}>
            <div className="wrapper text-center">
              <AddCircleOutlineIcon style={{ fontSize: '3rem' }} />
              <p className="lg">เพิ่ม Signature Block</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Dialog open={['create'].indexOf(process) > -1} onClose={() => onProcess()} 
      fullWidth={true} maxWidth="sm" scroll="paper" 
      PaperProps={{ component: 'form', onSubmit: onSubmit }} 
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
            <div className={`template-block ${block?._id === d._id? 'active': ''}`} 
              onClick={e => { e.preventDefault(); setBlock(d); }} 
            >
              <p className="lg mb-1">{d.name}</p>
              <img className="img border-1 bcolor-fgray" src={d.image} alt="Block" />
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
          <Button onClick={onProcess} 
            variant="contained" color="default" disableElevation 
            size="large" className="bradius tt-unset" style={{ minWidth: '7.5rem' }} 
          >
            <span className="h6">ปิด</span>
          </Button>
        </div>
      </DialogActions>
    </Dialog>

    <Dialog open={blockIndex > -1 && dataKey? true: false} onClose={() => onTemplateClose()} 
      fullWidth={true} maxWidth="xs" scroll="paper" 
      PaperProps={{ component: 'form', onSubmit: onTemplateSubmit }} 
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
        <div className="grids">
          {data?.type === 'text'? (<>
            <div className="grid sm-100">
              <TextField label="ข้อมูล" variant="outlined" 
                value={data?.value || ''} fullWidth 
                onChange={e => onTemplateChange('value', e.target.value)} 
              />
            </div>
            <div className="grid sm-100">
              <input type="color" 
                value={data?.color || ''} 
                onChange={e => onTemplateChange('color', e.target.value)} 
              />
            </div>
          </>): (<></>)}
        </div>
      </DialogContent>
      <DialogActions>
        <div className="btns mt-0">
          <Button type="submit" variant="contained" color="secondary" disableElevation 
            size="large" className="bradius tt-unset mr-2" style={{ minWidth: '7.5rem' }} 
          >
            <span className="h6">แก้ไข</span>
          </Button>
          <Button onClick={onTemplateClose} 
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