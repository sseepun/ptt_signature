import { useMemo } from 'react';

const Template01 = ({ data, onClick=()=>{} }) => {
  const thisData = useMemo(() => {
    return {
      field1: data?.field1 || { type: 'text', value: '[FirstName] [LastName]', color: '#1B1560' },
      field2: data?.field2 || { type: 'text', value: '[FirstNameEN] [LastNameEN]', color: '#1B1560' },
      field3: data?.field3 || { type: 'text', value: '[Position]', color: '#141414' },
      field4: data?.field4 || { type: 'text', value: '[PositionEN]', color: '#141414' },
      field5: data?.field5 || { type: 'text', value: '[Department]', color: '#141414' },
      field6: data?.field6 || { type: 'text', value: '[DepartmentEN]', color: '#141414' },
      field7: data?.field7 || { type: 'text', value: 'T [Telephone]', color: '#141414' },
      field8: data?.field8 || { type: 'text', value: 'M [Email]', color: '#141414' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-01">
      <h6 onClick={e => handleClick(e, 'field1')} className="editable fw-600" 
        style={{ color: thisData?.field1?.color || 'inherit' }} 
      >
        {thisData?.field1?.value || 'Field 1'}
      </h6>
      <h6 onClick={e => handleClick(e, 'field2')} className="editable fw-600" 
        style={{ color: thisData?.field2?.color || 'inherit' }} 
      >
        {thisData?.field2?.value || 'Field 2'}
      </h6>
      <div className="blocks">
        <div className="block">
          <p onClick={e => handleClick(e, 'field3')} className="editable xxs" 
            style={{ color: thisData?.field3?.color || 'inherit' }} 
          >
            {thisData?.field3?.value || 'Field 3'}
          </p>
          <p onClick={e => handleClick(e, 'field4')} className="editable xxs" 
            style={{ color: thisData?.field4?.color || 'inherit' }} 
          >
            {thisData?.field4?.value || 'Field 4'}
          </p>
        </div>
        <div className="block">
          <p onClick={e => handleClick(e, 'field5')} className="editable xxs" 
            style={{ color: thisData?.field5?.color || 'inherit' }} 
          >
            {thisData?.field5?.value || 'Field 5'}
          </p>
          <p onClick={e => handleClick(e, 'field6')} className="editable xxs" 
            style={{ color: thisData?.field6?.color || 'inherit' }} 
          >
            {thisData?.field6?.value || 'Field 6'}
          </p>
        </div>
        <div className="block">
          <p onClick={e => handleClick(e, 'field7')} className="editable xxs" 
            style={{ color: thisData?.field7?.color || 'inherit' }} 
          >
            {thisData?.field7?.value || 'Field 7'}
          </p>
          <p onClick={e => handleClick(e, 'field8')} className="editable xxs" 
            style={{ color: thisData?.field8?.color || 'inherit' }} 
          >
            {thisData?.field8?.value || 'Field 8'}
          </p>
        </div>
      </div>
    </div>
  )
}
export default Template01;