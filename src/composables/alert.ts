import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import swal from 'sweetalert2'

const DEFAULT_CONFIG: SweetAlertOptions = {
  heightAuto: false,
  confirmButtonText: 'ตกลง',
  cancelButtonText: 'ยกเลิก',
  buttonsStyling: false,
  customClass: {
    confirmButton: 'btn btn-primary mx-2',
    cancelButton: 'btn btn-default mx-2',
  },
}

export const unCancelableOptions = {
  allowEscapeKey: false,
  showCloseButton: false,
  allowOutsideClick: false,
}

export function showError (message: string | null = null, options: SweetAlertOptions = {}): Promise<SweetAlertResult> {
  options = {
    ...DEFAULT_CONFIG,
    title: '',
    text: message || 'เกิดข้อผิดพลาด',
    icon: 'error',
    ...options,
  } as SweetAlertOptions
  return swal.fire(options)
}

export function showMessage (message: string | null = null, icon: string|null = null): Promise<SweetAlertResult> {
  let MORE_CONFIG = {}
  if(icon) MORE_CONFIG = { icon }
  return swal.fire({
    ...DEFAULT_CONFIG,
    ...MORE_CONFIG,
    title: '',
    text: message || 'เกิดข้อผิดพลาด',
    confirmButtonText: 'ปิด'
  })
}

export function showWarning (message: string='',config:SweetAlertOptions= DEFAULT_CONFIG): Promise<SweetAlertResult> {
  return swal.fire({
    ...config,
    title: '',
    text: message,
    icon: 'warning',
  })
}

export function showConfirm (title: string, message: string = '', options: SweetAlertOptions = {}): Promise<boolean> {
  options = {
    ...DEFAULT_CONFIG,
    title,
    text: message || '',
    showCancelButton: true,
    icon: 'warning',
    ...options
  } as SweetAlertOptions
  return swal.fire(options).then((result: SweetAlertResult) => {
    return result.isConfirmed
  })
}

export function showProgress (title: string = 'กำลังดำเนินการ', message: string = '', options: SweetAlertOptions = {}): Promise<SweetAlertResult> {
  options = {
    ...DEFAULT_CONFIG,
    title,
    text: message || '',
    didOpen () {
      swal.showLoading(null)
    },
    ...unCancelableOptions,
    ...options,
  } as SweetAlertOptions
  return swal.fire(options)
}

export function showSuccess (title: string = 'ทำรายการสำเร็จ', message: string = '', options: SweetAlertOptions = {}): Promise<boolean> {
  options = {
    ...DEFAULT_CONFIG,
    ...options,
    title,
    text: message,
    showCancelButton: false,
    icon: 'success',
  } as SweetAlertOptions

  return swal.fire(options).then((result: SweetAlertResult) => {
    return result.isConfirmed
  })
}

export function showPrompt(title: string = 'กรุณากรอกเหตุผล'): Promise<SweetAlertResult> {
  return swal.fire({
    title,
    input: "textarea",
    inputAttributes: {
      autocapitalize: "off"
    },
    backdrop: false,
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    showLoaderOnConfirm: true,
    customClass: {
      container: 'modal-prompt'
    },
    preConfirm (value: any) {
      if(!value) {
        showError('กรุณากรอกเหตุผล')
      }
    }
  }).then((result: SweetAlertResult) => {
    return result
  });
}

export function dismissPopup () {
  swal.close()
}
