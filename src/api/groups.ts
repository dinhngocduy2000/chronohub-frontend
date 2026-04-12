import { GROUPS_ENDPOINTS } from '@/enum/endpoints'
import type { IResponseData } from '@/interface/api-response'
import type { ICreateGroupRequest, IGroupInfo } from '@/interface/groups'
import axiosConfig from '.'

export const createGroupApi = async (
  data: ICreateGroupRequest,
): Promise<IResponseData<IGroupInfo>> => {
  return await axiosConfig.post(GROUPS_ENDPOINTS.CREATE, data)
}
