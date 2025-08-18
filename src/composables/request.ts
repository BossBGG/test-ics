export function getTimeByFlag(request) {
  const { morning_flag = false, afternoon_flag = false } = request
  const time = []

  if (morning_flag)
    time.push('ช่วงเช้า (9.00-12.00)')

  if (morning_flag && afternoon_flag)
    time.push('-')

  if (afternoon_flag)
    time.push('ช่วงบ่าย (13.00 - 16.00)')

  return time.join(' ')
}

export function nowServiceCode() {
  const requestStore = useRequestStore()
  const { nowRequestCode } = storeToRefs(requestStore)

  return nowRequestCode.value
}

export function nowServiceID() {
  const serviceItemStore = useServiceItemStore()
  const { nowService } = storeToRefs(serviceItemStore)
  try {
    return nowService.value?.id
  } catch (e) {
    // console.log(e);
  }
}


export const SERVICE = {
  S1: 'S301',
  S2: 'S302',
  S3: 'S303',
  S4: 'S304',
  S5: 'S305',
  S6: 'S306',
  S7: 'S307',
  S8: 'S308',
  S9: 'S309',
  S10: 'S310',
  S11: 'S311',
  S12: 'S312',
  S13: 'S313',
  S14: 'S314',
  S15: 'S315',
  S16: 'S316',
  S17: 'S317',
  S18: 'S318',
  S19: 'S319',
  S20: 'S320',
  S21: 'S321',
  S22: 'S322',
  S23: 'S323',
  S24: 'S324',
  S25: 'S325',
  // S26: 'S326',
  S27: 'S327',
  S28: 'S328',
  S29: 'S329',
  S32: 'S332',
  S99: 'S399',
}
