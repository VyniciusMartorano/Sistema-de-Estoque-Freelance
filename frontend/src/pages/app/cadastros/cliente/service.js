import { apiBase } from '@/api/apibase'

class Service {
  getUser() {
    return apiBase.axios.get(`/user/`)
  }
}
export default Service
