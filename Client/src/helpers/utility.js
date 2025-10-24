
export const getValueOrDefault = (val, _default='') => {
  return val ?? _default;
}

export const replaceRules = (obj, user) => {
  if(obj?.type === 'text' && user?.Id){
    obj.value = `${obj.value ?? ''}`
      .replace(/\[EmployeeId\]/g, user.EmployeeId || '')
      .replace(/\[Prefix\]/g, user.Prefix || '')
      .replace(/\[PrefixEN\]/g, user.PrefixEN || '')
      .replace(/\[FirstName\]/g, user.FirstName || '')
      .replace(/\[FirstNameEN\]/g, user.FirstNameEN || '')
      .replace(/\[LastName\]/g, user.LastName || '')
      .replace(/\[LastNameEN\]/g, user.LastNameEN || '')
      .replace(/\[Position\]/g, user.Title || '')
      .replace(/\[PositionEN\]/g, user.TitleEN || '')
      .replace(/\[Email\]/g, user.Email || '')
      .replace(/\[Telephone\]/g, user.Telephone || '')
      .replace(/\[Mobile\]/g, user.Mobile || '')
      .replace(/\[Department\]/g, user.Department || '')
      .replace(/\[DepartmentEN\]/g, user.DepartmentEN || '')
      .replace(/\[DepartmentLong\]/g, user.DepartmentLong || '')
      .replace(/\[DepartmentAbbr\]/g, user.DepartmentAbbr || '');
  }
  return obj;
}

export const formatDate = (value=null) => {
  const _date = new Date(value || null);
  return _date.getDate().toString().padStart(2, '0') 
    + '/' + (_date.getMonth() + 1).toString().padStart(2, '0')
    + '/' + _date.getFullYear();
}
export const formatTime = (value=null) => {
  const _date = new Date(value || null);
  return _date.getHours().toString().padStart(2, '0')
    + ':' + _date.getMinutes().toString().padStart(2, '0');
}
