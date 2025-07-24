import { useMemo } from 'react';

const Template03 = ({ data, onClick=()=>{} }) => {
  const thisData = useMemo(() => {
    return {
      field1: data?.field1 || { type: 'background', value: '/img/template/03-bg.jpg' },
      field2: data?.field2 || { type: 'image', value: '/img/template/03-logo.png' },
      field3: data?.field3 || { type: 'text', value: '[FirstNameEN] [LastNameEN]', color: '#1B1560' },
      field4: data?.field4 || { type: 'text', value: '[PositionEN]', color: '#02adee' },
      field5: data?.field5 || { type: 'text', value: '[DepartmentEN]', color: '#02adee' },
      field6: data?.field6 || { type: 'text', value: 'T. ', color: '#1B1560' },
      field7: data?.field7 || { type: 'text', value: '[Telephone]', color: '#02adee' },
      field8: data?.field8 || { type: 'text', value: ' / M. ', color: '#1B1560' },
      field9: data?.field9 || { type: 'text', value: '[Mobile]', color: '#02adee' },
      field10: data?.field10 || { type: 'text', value: 'Email : ', color: '#1B1560' },
      field11: data?.field11 || { type: 'text', value: '[Email]', color: '#02adee' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-03">
      <img className="editable img" alt="Background" 
        onClick={e => handleClick(e, 'field1')} 
        src={thisData?.field1?.value || '/img/template/03-bg.jpg'} 
      />
      <div className="wrapper">
        <img className="editable logo" alt="Logo" 
          onClick={e => handleClick(e, 'field2')} 
          src={thisData?.field2?.value || '/img/template/03-logo.png'} 
        />
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
          <p>
            <span onClick={e => handleClick(e, 'field6')} className="editable" 
              style={{ color: thisData?.field6?.color || 'inherit' }} 
            >
              {thisData?.field6?.value || 'Field 6'}
            </span>
            <span onClick={e => handleClick(e, 'field7')} className="editable" 
              style={{ color: thisData?.field7?.color || 'inherit' }} 
            >
              {thisData?.field7?.value || 'Field 7'}
            </span>
            <span onClick={e => handleClick(e, 'field8')} className="editable" 
              style={{ color: thisData?.field8?.color || 'inherit' }} 
            >
              {thisData?.field8?.value || 'Field 8'}
            </span>
            <span onClick={e => handleClick(e, 'field9')} className="editable" 
              style={{ color: thisData?.field9?.color || 'inherit' }} 
            >
              {thisData?.field9?.value || 'Field 9'}
            </span>
          </p>
          <p>
            <span onClick={e => handleClick(e, 'field10')} className="editable" 
              style={{ color: thisData?.field10?.color || 'inherit' }} 
            >
              {thisData?.field10?.value || 'Field 10'}
            </span>
            <span onClick={e => handleClick(e, 'field11')} className="editable" 
              style={{ color: thisData?.field11?.color || 'inherit' }} 
            >
              {thisData?.field11?.value || 'Field 11'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Template03;