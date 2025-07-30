import { useMemo } from 'react';

const Template01 = ({ data, disabled=false, onClick=()=>{} }) => {
  const classer = disabled? '': 'editable';
  const thisData = useMemo(() => {
    return {
      Field1: data?.Field1 || { type: 'text', value: '[FirstName] [LastName]', color: '#1B1560' },
      Field2: data?.Field2 || { type: 'text', value: '[FirstNameEN] [LastNameEN]', color: '#1B1560' },
      Field3: data?.Field3 || { type: 'text', value: '[Position]', color: '#666666' },
      Field4: data?.Field4 || { type: 'text', value: '[PositionEN]', color: '#666666' },
      Field5: data?.Field5 || { type: 'text', value: '[Department]', color: '#666666' },
      Field6: data?.Field6 || { type: 'text', value: '[DepartmentEN]', color: '#666666' },
      field7: data?.field7 || { type: 'text', value: 'T [Telephone]', color: '#666666' },
      Field8: data?.Field8 || { type: 'text', value: 'M [Email]', color: '#666666' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    if(!disabled) onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-01">
      <h6 onClick={e => handleClick(e, 'Field1')} className={classer} 
        style={{ color: thisData?.Field1?.color || 'inherit' }} 
      >
        {thisData?.Field1?.value || 'Field 1'}
      </h6>
      <h6 onClick={e => handleClick(e, 'Field2')} className={classer} 
        style={{ color: thisData?.Field2?.color || 'inherit' }} 
      >
        {thisData?.Field2?.value || 'Field 2'}
      </h6>
      <div className="blocks">
        <div className="block">
          <p onClick={e => handleClick(e, 'Field3')} className={classer} 
            style={{ color: thisData?.Field3?.color || 'inherit' }} 
          >
            {thisData?.Field3?.value || 'Field 3'}
          </p>
          <p onClick={e => handleClick(e, 'Field4')} className={classer} 
            style={{ color: thisData?.Field4?.color || 'inherit' }} 
          >
            {thisData?.Field4?.value || 'Field 4'}
          </p>
        </div>
        <div className="block">
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
        </div>
        <div className="block">
          <p onClick={e => handleClick(e, 'field7')} className={classer} 
            style={{ color: thisData?.field7?.color || 'inherit' }} 
          >
            {thisData?.field7?.value || 'Field 7'}
          </p>
          <p onClick={e => handleClick(e, 'Field8')} className={classer} 
            style={{ color: thisData?.Field8?.color || 'inherit' }} 
          >
            {thisData?.Field8?.value || 'Field 8'}
          </p>
        </div>
      </div>
    </div>
  )
}
export default Template01;