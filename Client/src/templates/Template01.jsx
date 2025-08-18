import { useMemo } from 'react';
import { replaceRules } from '@/helpers/utility';

const Template01 = ({ data, disabled=false, onClick=()=>{}, user=null, textWrap=false }) => {
  const classer = disabled? '': 'editable';
  const thisData = useMemo(() => {
    return {
      Field1: replaceRules(data?.Field1 || { type: 'text', value: '[Prefix] [FirstName] [LastName]', color: '#1B1560' }, user),
      Field2: replaceRules(data?.Field2 || { type: 'text', value: '[PrefixEN] [FirstNameEN] [LastNameEN]', color: '#1B1560' }, user),
      Field3: replaceRules(data?.Field3 || { type: 'text', value: '[Position]', color: '#666666' }, user),
      Field4: replaceRules(data?.Field4 || { type: 'text', value: '[EmployeeId]', color: '#666666' }, user),
      Field5: replaceRules(data?.Field5 || { type: 'text', value: '[Department]', color: '#666666' }, user),
      Field6: replaceRules(data?.Field6 || { type: 'text', value: '[DepartmentEN]', color: '#666666' }, user),
      Field7: replaceRules(data?.Field7 || { type: 'text', value: 'T [Telephone]', color: '#666666' }, user),
      Field8: replaceRules(data?.Field8 || { type: 'text', value: 'M [Email]', color: '#666666' }, user),
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    if(!disabled) onClick(field, thisData?.[field] || null);
  }
  const styles = textWrap? { whiteSpace: 'wrap' }: {};
  return (
    <div className="template template-01">
      <h6 onClick={e => handleClick(e, 'Field1')} className={classer} 
        style={{ color: thisData?.Field1?.color || 'inherit' }} 
      >
        {thisData?.Field1?.value || (disabled? '': 'Field 1')}
      </h6>
      <h6 onClick={e => handleClick(e, 'Field2')} className={classer} 
        style={{ color: thisData?.Field2?.color || 'inherit' }} 
      >
        {thisData?.Field2?.value || (disabled? '': 'Field 2')}
      </h6>
      <table>
        <tbody>
          <tr>
            <td style={styles}>
              <p onClick={e => handleClick(e, 'Field3')} className={classer} 
                style={{ color: thisData?.Field3?.color || 'inherit' }} 
              >
                {thisData?.Field3?.value || (disabled? '': 'Field 3')}
              </p>
            </td>
            <td style={styles}>
              <p onClick={e => handleClick(e, 'Field5')} className={classer} 
                style={{ color: thisData?.Field5?.color || 'inherit' }} 
              >
                {thisData?.Field5?.value || (disabled? '': 'Field 5')}
              </p>
            </td>
            <td style={styles}>
              <p onClick={e => handleClick(e, 'field7')} className={classer} 
                style={{ color: thisData?.Field7?.color || 'inherit' }} 
              >
                {thisData?.Field7?.value || (disabled? '': 'Field 7')}
              </p>
            </td>
          </tr>
          <tr>
            <td style={styles}>
              <p onClick={e => handleClick(e, 'Field4')} className={classer} 
                style={{ color: thisData?.Field4?.color || 'inherit' }} 
              >
                {thisData?.Field4?.value || (disabled? '': 'Field 4')}
              </p>
            </td>
            <td style={styles}>
              <p onClick={e => handleClick(e, 'Field6')} className={classer} 
                style={{ color: thisData?.Field6?.color || 'inherit' }} 
              >
                {thisData?.Field6?.value || (disabled? '': 'Field 6')}
              </p>
            </td>
            <td style={styles}>
              <p onClick={e => handleClick(e, 'Field8')} className={classer} 
                style={{ color: thisData?.Field8?.color || 'inherit' }} 
              >
                {thisData?.Field8?.value || (disabled? '': 'Field 8')}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default Template01;