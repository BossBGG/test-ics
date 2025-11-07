const load = ref({})

export async function checkLoad(name, callApi = () => { }) {
  load.value[name] ||= false

  if (load.value[name]) {
    return true
  } else {
    load.value[name] = true
    await callApi()
    return false
  }
}

export function clearLoad(name){
  load.value[name] = false
}