import { getValueOrDefault } from '@/helpers/utility';
import { Chip } from '@mui/material';

export class EmailTemplateModel {
  constructor(data) {
    this.Id = getValueOrDefault(data?.Id, null);
    
    this.Name = getValueOrDefault(data?.Name, null);
    this.Template = getValueOrDefault(data?.Template, null);

    this.Blocks = this.getBlocks(this.Template);
    
    this.Status = getValueOrDefault(data?.Status, 0);

    this.CreatedAt = getValueOrDefault(data?.CreatedAt, null);
    this.UpdatedAt = getValueOrDefault(data?.UpdatedAt, null);
  }

  isValid(){ return this.Id? true: false; }

  getBlock(_data){
    return {
      Counting: _data?.Counting || 0,
      Type: _data?.Type,
      Name: _data?.Name,
      Image: _data?.Image,
      Data: _data?.Data || {},
    };
  }
  getBlocks(_template){
    return JSON.parse(_template || '[]').filter(d => d?.Type).map(d => this.getBlock(d));
  }

  displayStatus(){
    if(this.isValid() && this.Status) return (<Chip label="เปิดใช้งาน" color="success" />);
    return (<Chip label="ปิดใช้งาน" color="warning" />);
  }
}