import { apiBase } from '@/api/apibase'

class Service {
  getGestores() {
    return apiBase.axios.get(`/user/get_gestores/`)
  }

  search(payload) {
    return apiBase.axios.post(`/cliente/search/`, { ...payload })
  }

  saveOrUpdate(payload) {
    return apiBase.axios[payload.id ? 'put' : 'post'](
      `/cliente/${payload.id ? payload.id + '/' : ''}`,
      payload
    )
  }

  deleteCliente(clienteId) {
    return apiBase.axios.delete(`/cliente/${clienteId}/`)
  }

  getClienteById(clienteId) {
    return apiBase.axios.get(`/cliente/${clienteId}/`)
  }
}
export default Service
