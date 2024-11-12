import { apiBase } from '@/api/apibase'

class Service {
  search(query) {
    return apiBase.axios.get(`/produto/search/?query=${query}`)
  }

  saveOrUpdate(payload) {
    return apiBase.axios[payload.id ? 'put' : 'post'](
      `/produto/${payload.id ? payload.id + '/' : ''}`,
      payload,
      { headers: { 'Content-Type': `multipart/form-data` } }
    )
  }

  deleteProduto(produtoId) {
    return apiBase.axios.delete(`/produto/${produtoId}/`)
  }

  getProdutoById(produtoId) {
    return apiBase.axios.get(`/produto/${produtoId}/`)
  }
}
export default Service
