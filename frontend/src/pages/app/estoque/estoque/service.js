import { apiBase } from '@/api/apibase'

class Service {
  search(filters) {
    return apiBase.axios.post(`/venda/search/`, filters)
  }

  getProdutos() {
    return apiBase.axios.get(`/produto/`)
  }
}

export default Service
