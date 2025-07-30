import momentTZ from 'moment-timezone';

export const getValueOrDefault = (val, _default='') => {
  return val ?? _default;
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
