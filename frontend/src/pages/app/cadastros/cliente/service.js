import { apiBase } from '@/api/apibase'

class Service {
  getGestores() {
    return apiBase.axios.get(`/user/get_gestores/`)
  }
}
export default Service
