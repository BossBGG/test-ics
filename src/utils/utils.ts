import { Notify } from 'quasar'

export function copyToClipboard(text: string): void {
  // Guard for SSR / non-browser environments
  if (typeof window === 'undefined')
    return

  const notifySuccess = () =>
    Notify.create({
      type: '',
      icon: 'content_copy',
      message: 'คัดลอกเรียบร้อยแล้ว',
      position: 'top',
      timeout: 2000,
      classes: 'default-notify',
      actions: [{ icon: 'close' }],
    })

  const notifyError = (err?: unknown) => {
    Notify.create({
      type: 'negative',
      message: 'ไม่สามารถคัดลอกตำแหน่งได้',
      position: 'top',
      timeout: 2000,
    })
    if (err)
      console.error('Could not copy text: ', err)
  }

  // Modern Clipboard API
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(notifySuccess)
      .catch(notifyError)
    return
  }

  // Fallback for older browsers
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    if (ok)
      notifySuccess()
    else
      notifyError(new Error('execCommand failed'))
  }
  catch (err) {
    notifyError(err)
  }
}
