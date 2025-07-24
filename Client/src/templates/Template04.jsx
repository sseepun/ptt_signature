import { useMemo } from 'react';

const Template04 = ({ data, onClick=()=>{} }) => {
  const thisData = useMemo(() => {
    return {
      field1: data?.field1 || { type: 'background', value: '/img/template/04-bg.jpg' },
      field2: data?.field2 || { type: 'image', value: '/img/template/04-logo.png' },
      field3: data?.field3 || { type: 'text', value: '[FirstNameEN] [LastNameEN]', color: '#ffffff' },
      field4: data?.field4 || { type: 'text', value: '[PositionEN]', color: '#ffffff' },
      field5: data?.field5 || { type: 'text', value: '[DepartmentEN]', color: '#ffffff' },
      field6: data?.field6 || { type: 'text', value: 'T. [Telephone] / M. [Mobile]', color: '#ffffff' },
      field7: data?.field7 || { type: 'text', value: 'Email : [Email]', color: '#ffffff' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-04">
      <img className="editable img" alt="Background" 
        onClick={e => handleClick(e, 'field1')} 
        src={thisData?.field1?.value || '/img/template/04-bg.jpg'} 
      />
      <div className="wrapper">
        <div className="block">
          <h6 onClick={e => handleClick(e, 'field3')} className="editable" 
            style={{ color: thisData?.field3?.color || 'inherit' }} 
          >
            {thisData?.field3?.value || 'Field 3'}
          </h6>
          <p onClick={e => handleClick(e, 'field4')} className="editable" 
            style={{ color: thisData?.field4?.color || 'inherit' }} 
          >
            {thisData?.field4?.value || 'Field 4'}
          </p>
          <p onClick={e => handleClick(e, 'field5')} className="editable" 
            style={{ color: thisData?.field5?.color || 'inherit' }} 
          >
            {thisData?.field5?.value || 'Field 5'}
          </p>
          <p onClick={e => handleClick(e, 'field6')} className="editable" 
            style={{ color: thisData?.field6?.color || 'inherit' }} 
          >
            {thisData?.field6?.value || 'Field 6'}
          </p>
          <p onClick={e => handleClick(e, 'field7')} className="editable" 
            style={{ color: thisData?.field7?.color || 'inherit' }} 
          >
            {thisData?.field7?.value || 'Field 7'}
          </p>
        </div>
        <img className="editable logo" alt="Logo" 
          onClick={e => handleClick(e, 'field2')} 
          src={thisData?.field2?.value || '/img/template/04-logo.png'} 
        />
      </div>
    </div>
  )
}
export default Template04;