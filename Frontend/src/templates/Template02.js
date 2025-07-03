import { useMemo } from 'react';

const Template02 = ({ data, onClick=()=>{} }) => {
  const thisData = useMemo(() => {
    return {
      field1: data?.field1 || { type: 'background', value: '/img/template/02-bg.jpeg' },
      field2: data?.field2 || { type: 'image', value: '/img/template/02-logo.png' },
      field3: data?.field3 || { type: 'text', value: 'www.pttplc.com', color: '#ffffff' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-02">
      <img className="editable img" alt="Background" 
        onClick={e => handleClick(e, 'field1')} 
        src={thisData?.field1?.value || '/img/template/02-bg.jpeg'} 
      />
      <div className="wrapper">
        <img className="editable logo" alt="Logo" 
          onClick={e => handleClick(e, 'field2')} 
          src={thisData?.field2?.value || '/img/template/02-logo.png'} 
        />
        <p onClick={e => handleClick(e, 'field3')} className="editable xxs" 
          style={{ color: thisData?.field3?.color || 'inherit' }} 
        >
          {thisData?.field3?.value || 'Field 3'}
        </p>
      </div>
    </div>
  )
}
export default Template02;