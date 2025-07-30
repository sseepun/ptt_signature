import { useMemo } from 'react';

const Template04 = ({ data, disabled=false, onClick=()=>{} }) => {
  const classer = disabled? '': 'editable';
  const thisData = useMemo(() => {
    return {
      Field1: data?.Field1 || { type: 'background', value: '/img/template/04-bg.jpg' },
      Field2: data?.Field2 || { type: 'image', value: '/img/template/04-logo.png' },
      Field3: data?.Field3 || { type: 'text', value: '[FirstNameEN] [LastNameEN]', color: '#ffffff' },
      Field4: data?.Field4 || { type: 'text', value: '[PositionEN]', color: '#ffffff' },
      Field5: data?.Field5 || { type: 'text', value: '[DepartmentEN]', color: '#ffffff' },
      Field6: data?.Field6 || { type: 'text', value: 'T. [Telephone] / M. [Mobile]', color: '#ffffff' },
      Field7: data?.Field7 || { type: 'text', value: 'Email : [Email]', color: '#ffffff' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    if(!disabled) onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-04">
      <img className={`${classer} img`} alt="Background" 
        onClick={e => handleClick(e, 'Field1')} 
        src={thisData?.Field1?.value || '/img/template/04-bg.jpg'} 
      />
      <div className="wrapper">
        <div className="block">
          <h6 onClick={e => handleClick(e, 'Field3')} className={classer} 
            style={{ color: thisData?.Field3?.color || 'inherit' }} 
          >
            {thisData?.Field3?.value || 'Field 3'}
          </h6>
          <p onClick={e => handleClick(e, 'Field4')} className={classer} 
            style={{ color: thisData?.Field4?.color || 'inherit' }} 
          >
            {thisData?.Field4?.value || 'Field 4'}
          </p>
          <p onClick={e => handleClick(e, 'Field5')} className={classer} 
            style={{ color: thisData?.Field5?.color || 'inherit' }} 
          >
            {thisData?.Field5?.value || 'Field 5'}
          </p>
          <p onClick={e => handleClick(e, 'Field6')} className={classer} 
            style={{ color: thisData?.Field6?.color || 'inherit' }} 
          >
            {thisData?.Field6?.value || 'Field 6'}
          </p>
          <p onClick={e => handleClick(e, 'Field7')} className={classer} 
            style={{ color: thisData?.Field7?.color || 'inherit' }} 
          >
            {thisData?.Field7?.value || 'Field 7'}
          </p>
        </div>
        <img className={`${classer} logo`} alt="Logo" 
          onClick={e => handleClick(e, 'Field2')} 
          src={thisData?.Field2?.value || '/img/template/04-logo.png'} 
        />
      </div>
    </div>
  )
}
export default Template04;