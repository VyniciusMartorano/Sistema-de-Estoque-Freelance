import { apiBase } from '@/api/apibase'

class Service {
  search(filters) {
    return apiBase.axios.post(`/venda/search/`, filters)
  }

  saveOrUpdate(payload) {
    return apiBase.axios[payload.id ? 'put' : 'post'](
      `/ci/${payload.id ? payload.id + '/' : ''}`,
      payload
    )
  }

  saveItens(payload) {
    return apiBase.axios.post(`/ci_itens/`, payload)
  }

  getCiById(ciId) {
    return apiBase.axios.get(`/ci/${ciId}/`)
  }

  getProdutos() {
    return apiBase.axios.get(`/produto/`)
  }

  getItensByCI(ci_id) {
    return apiBase.axios.post(`/ci_itens/search/`, { ci_id })
  }
}

export default Service
