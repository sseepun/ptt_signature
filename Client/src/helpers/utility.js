import momentTZ from 'moment-timezone';

export const getValueOrDefault = (val, _default='') => {
  return val ?? _default;
}

export const replaceRules = (obj, user) => {
  if(obj?.type === 'text' && user?.Id){
    obj.value = `${obj.value ?? ''}`
      .replace(/\[Prefix\]/g, user.Prefix || '')
      .replace(/\[PrefixEN\]/g, user.PrefixEN || '')
      .replace(/\[FirstName\]/g, user.FirstName || '')
      .replace(/\[FirstNameEN\]/g, user.FirstNameEN || '')
      .replace(/\[LastName\]/g, user.LastName || '')
      .replace(/\[LastNameEN\]/g, user.LastNameEN || '')
      .replace(/\[Position\]/g, user.Title || '')
      .replace(/\[PositionEN\]/g, user.TitleEN || '')
      .replace(/\[Department\]/g, user.Department || '')
      .replace(/\[DepartmentEN\]/g, user.DepartmentEN || '')
      .replace(/\[Email\]/g, user.Email || '')
      .replace(/\[Telephone\]/g, '+66 93 919-4699')
      .replace(/\[Mobile\]/g, '+66 93 919-4699');
  }
  return obj;
}

export const formatDate = (value=null, format='DD/MM/YYYY', thai=false) => {
  let string;
  if(!value) string = momentTZ(new Date()).tz('Asia/Bangkok').format(format);
  else string = momentTZ(new Date(String(value))).tz('Asia/Bangkok').format(format);
  if(string){
    if(thai){
      string = string.split('/');
      return `${string[0]}/${string[1]}/${parseInt(string[2])+543}`;
    }
    return string;
  }
  return '';
}
export const formatTime = (value=null, format='HH:mm') => {
  let string;
  if(!value) string = momentTZ(new Date()).tz('Asia/Bangkok').format(format);
  else string = momentTZ(new Date(String(value))).tz('Asia/Bangkok').format(format);
  if(string) return string;
  return '';
}
