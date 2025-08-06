import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export const alertChange = (type, message, errors=[]) => {
  const MySwal = withReactContent(Swal);
  const option = {
    title: message,
    text: errors.length? errors.join(' '): '',
    confirmButtonText: 'ตกลง',
    customClass: {
      confirmButton: 'h6',
      cancelButton: 'h6',
      denyButton: 'h6',
    },
  };
  if(type === 'Danger'){
    MySwal.fire({ ...option, icon: 'error' });
  }else if(type === 'Warning'){
    MySwal.fire({ ...option, icon: 'warning' });
  }else if(type === 'Success' || type === 'Info'){
    MySwal.fire({ ...option, icon: 'success' });
  }else if(type === 'Info'){
    MySwal.fire({ ...option, icon: 'info' });
  }
}
