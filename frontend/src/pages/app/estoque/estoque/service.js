import { apiBase } from '@/api/apibase'

class Service {
  search(filters) {
    return apiBase.axios.post(`/estoqueextrato/search/`, filters)
  }

  getProdutos() {
    return apiBase.axios.get(`/produto/`)
  }

  getUsers() {
    return apiBase.axios.get(`/user/get_all/`)
  }
}

export default Service
