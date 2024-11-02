import { apiBase } from '@/api/apibase'

class Service {
  getGestores() {
    return apiBase.axios.get(`/user/get_gestores/`)
  }

  search(payload) {
    return apiBase.axios.post(`/cliente/search/`, { ...payload })
  }
}
export default Service
