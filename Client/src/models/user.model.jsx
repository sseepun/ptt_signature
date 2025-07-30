import { getValueOrDefault } from '@/helpers/utility';

export class UserModel {
  constructor(data) {
    this.Id = getValueOrDefault(data?.Id, null);
    
    this.EmployeeId = getValueOrDefault(data?.EmployeeId, null);
    this.Department = getValueOrDefault(data?.Department, null);

    this.IsAdmin = getValueOrDefault(data?.IsAdmin, 0);

    this.Title = getValueOrDefault(data?.Title, null);
    this.Prefix = getValueOrDefault(data?.Prefix, null);
    this.FirstName = getValueOrDefault(data?.FirstName, null);
    this.LastName = getValueOrDefault(data?.LastName, null);

    this.Email = getValueOrDefault(data?.Email, null);
    this.Avatar = getValueOrDefault(data?.Avatar, '/img/avatar/01.png');
    
    this.Status = getValueOrDefault(data?.Status, 0);

    this.CreatedAt = getValueOrDefault(data?.CreatedAt, null);
    this.UpdatedAt = getValueOrDefault(data?.UpdatedAt, null);
  }

  isValid(){ return this.Id? true: false; }

  displayName(){
    if(this.FirstName || this.LastName) return `${this.FirstName || ''} ${this.LastName || ''}`.trim();
    if(this.Email) return this.Email;
    return '';
  }
  displayRole(){
    return this.IsAdmin? 'Admin' : 'User';
  }
  displayStatus(){
    if(this.isValid()){
      if(this.Status === 1) return (<span className="ss-tag bg-success">Active</span>);
      return (<span className="ss-tag bg-warning">Inactive</span>);
    }
    return (<span className="ss-tag bg-warning">Inactive</span>);
  }

  isSignedIn(){ return this.Id && this.Status === 1? true: false; }

  isSuperAdmin(){ return this.isSignedIn() && this.IsAdmin? true: false; }
  isAdmin(){ return this.isSignedIn() && this.IsAdmin? true: false; }
  isUser(){ return this.isSignedIn() && !this.IsAdmin? true: false; }
}