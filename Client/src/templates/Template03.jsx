import { useMemo } from 'react';

const Template03 = ({ data, disabled=false, onClick=()=>{} }) => {
  const classer = disabled? '': 'editable';
  const thisData = useMemo(() => {
    return {
      Field1: data?.Field1 || { type: 'background', value: '/img/template/03-bg.jpg' },
      Field2: data?.Field2 || { type: 'image', value: '/img/template/03-logo.png' },
      Field3: data?.Field3 || { type: 'text', value: '[FirstNameEN] [LastNameEN]', color: '#1B1560' },
      Field4: data?.Field4 || { type: 'text', value: '[PositionEN]', color: '#02adee' },
      Field5: data?.Field5 || { type: 'text', value: '[DepartmentEN]', color: '#02adee' },
      Field6: data?.Field6 || { type: 'text', value: 'T. ', color: '#1B1560' },
      Field7: data?.Field7 || { type: 'text', value: '[Telephone]', color: '#02adee' },
      Field8: data?.Field8 || { type: 'text', value: ' / M. ', color: '#1B1560' },
      Field9: data?.Field9 || { type: 'text', value: '[Mobile]', color: '#02adee' },
      Field10: data?.Field10 || { type: 'text', value: 'Email : ', color: '#1B1560' },
      Field11: data?.Field11 || { type: 'text', value: '[Email]', color: '#02adee' },
    };
  }, [data]);
  const handleClick = (e=null, field='') => {
    e?.preventDefault();
    if(!disabled) onClick(field, thisData?.[field] || null);
  }
  return (
    <div className="template template-03">
      <img className={`${classer} img`} alt="Background" 
        onClick={e => handleClick(e, 'Field1')} 
        src={thisData?.Field1?.value || '/img/template/03-bg.jpg'} 
      />
      <div className="wrapper">
        <img className={`${classer} logo`} alt="Logo" 
          onClick={e => handleClick(e, 'Field2')} 
          src={thisData?.Field2?.value || '/img/template/03-logo.png'} 
        />
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
          <p>
            <span onClick={e => handleClick(e, 'Field6')} className={classer} 
              style={{ color: thisData?.Field6?.color || 'inherit' }} 
            >
              {thisData?.Field6?.value || 'Field 6'}
            </span>
            <span onClick={e => handleClick(e, 'Field7')} className={classer} 
              style={{ color: thisData?.Field7?.color || 'inherit' }} 
            >
              {thisData?.Field7?.value || 'Field 7'}
            </span>
            <span onClick={e => handleClick(e, 'Field8')} className={classer} 
              style={{ color: thisData?.Field8?.color || 'inherit' }} 
            >
              {thisData?.Field8?.value || 'Field 8'}
            </span>
            <span onClick={e => handleClick(e, 'Field9')} className={classer} 
              style={{ color: thisData?.Field9?.color || 'inherit' }} 
            >
              {thisData?.Field9?.value || 'Field 9'}
            </span>
          </p>
          <p>
            <span onClick={e => handleClick(e, 'Field10')} className={classer} 
              style={{ color: thisData?.Field10?.color || 'inherit' }} 
            >
              {thisData?.Field10?.value || 'Field 10'}
            </span>
            <span onClick={e => handleClick(e, 'Field11')} className={classer} 
              style={{ color: thisData?.Field11?.color || 'inherit' }} 
            >
              {thisData?.Field11?.value || 'Field 11'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Template03;