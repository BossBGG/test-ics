import {getWorkerOptions} from "~/api/options_api";
import {Options, WorkerOptionObj} from "~/api/types";

export async function fetchWorkerListOptions(search: string = "") {
  const res = await getWorkerOptions(search)
  if(res.status === 200 && res.data.data) {
    let options: Options[] = []
    res.data.data.map((item: WorkerOptionObj) => {
      options.push({ value: item.username, label: `${item.username} - ${item.firstName} ${item.lastName}`, data: item })
    })
    return options
  }
  return []
}
