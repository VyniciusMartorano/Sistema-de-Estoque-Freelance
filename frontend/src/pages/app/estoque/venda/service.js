import { apiBase } from '@/api/apibase'

class Service {
  search(filters) {
    return apiBase.axios.post(`/venda/search/`, filters)
  }

  saveOrUpdate(payload) {
    return apiBase.axios[payload.id ? 'put' : 'post'](
      `/venda/${payload.id ? payload.id + '/' : ''}`,
      payload
    )
  }

  saveItens(payload) {
    return apiBase.axios.post(`/vendaitems/`, payload)
  }

  getVendaById(vendaId) {
    return apiBase.axios.get(`/venda/${vendaId}/`)
  }

  excluirVenda(vendaId) {
    return apiBase.axios.delete(`/venda/${vendaId}/`)
  }

  getProdutosComSaldo(userId) {
    return apiBase.axios.get(`/produto/get_produtos_dto/?user_id=${userId}`)
  }

  getClientes() {
    return apiBase.axios.get(`/cliente/`)
  }

  getItensVenda(vendaId) {
    return apiBase.axios.post(`/vendaitems/search/`, { vendaId })
  }
}

export default Service
