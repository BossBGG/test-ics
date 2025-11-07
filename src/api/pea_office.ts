import api, {ApiResponse} from "~/api/api";
import {PeaOrganize} from "~/api/types";

export const getPeaOfficeOptions = () : Promise<ApiResponse<{data: PeaOrganize[]}>> => {
  return api.get('v1/offices')
}
