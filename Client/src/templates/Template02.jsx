import { useMemo } from 'react';

const Template02 = ({ data, disabled=false, onClick=()=>{} }) => {
  const classer = disabled? '': 'editable';
  const thisData = useMemo(() => {
    return {
      Field1: data?.Field1 || { type: 'background', value: '/img/template/02-bg.jpg' },
      Field2: data?.Field2 || { type: 'image', value: '/img/template/02-logo.png' },
      Field3: data?.Field3 || { type: 'text', value: 'www.pttplc.com', color: '#ffffff' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    if(!disabled) onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-02">
      <img className={`${classer} img`} alt="Background" 
        onClick={e => handleClick(e, 'Field1')} 
        src={thisData?.Field1?.value || '/img/template/02-bg.jpg'} 
      />
      <div className="wrapper">
        <img className={`${classer} logo`} alt="Logo" 
          onClick={e => handleClick(e, 'Field2')} 
          src={thisData?.Field2?.value || '/img/template/02-logo.png'} 
        />
        <p onClick={e => handleClick(e, 'Field3')} className={classer} 
          style={{ color: thisData?.Field3?.color || 'inherit' }} 
        >
          {thisData?.Field3?.value || 'Field 3'}
        </p>
      </div>
    </div>
  )
}
export default Template02;