import { UserRoleModel } from '.';
import { unescape } from 'html-escaper';

export class UserModel {
  constructor(data) {
    this._id = data?._id || null;
    
    this.role = new UserRoleModel(data?.role || {});

    this.firstname = data?.firstname ? unescape(data.firstname) : null;
    this.lastname = data?.lastname ? unescape(data.lastname) : null;

    this.username = data?.username || null;
    this.email = data?.email || null;
    this.avatar = data?.avatar || '/img/avatar/01.png';

    this.department = data?.department || null;
    this.position = data?.position || null;

    this.status = data?.status ?? 0;
  }

  isValid(){ return this._id? true: false; }

  displayName(){
    if(this.firstname || this.lastname) return `${this.firstname || ''} ${this.lastname || ''}`.trim();
    if(this.username) return this.username;
    return '';
  }
  displayRole(){
    return this.role.displayName();
  }
  displayStatus(){
    if(this.isValid()){
      if(this.status === 1) return (<span className="ss-tag bg-success">Active</span>);
      return (<span className="ss-tag bg-warning">Inactive</span>);
    }
    return (<span className="ss-tag bg-warning">Inactive</span>);
  }

  isSignedIn(){ return this._id && this.status === 1 && this.role.isValid()? true: false; }

  isSuperAdmin(){ return this.isSignedIn() && [99].indexOf(this.role.level) > -1? true: false; }
  isAdmin(){ return this.isSignedIn() && [98, 99].indexOf(this.role.level) > -1? true: false; }
  isUser(){ return this.isSignedIn() && [1].indexOf(this.role.level) > -1? true: false; }
}