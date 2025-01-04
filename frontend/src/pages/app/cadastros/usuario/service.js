import { apiBase } from '@/api/apibase'

class Service {
  search(payload) {
    return apiBase.axios.post(`/user/search/`, payload)
  }

  saveOrUpdate(payload, userId) {
    return apiBase.axios[userId ? 'patch' : 'post'](
      `/user/${userId ? userId + '/' : ''}`,
      userId
        ? {
            username: payload.username,
            first_name: payload.first_name,
            password: payload.password,
          }
        : payload
    )
  }

  inativeUser(usuario) {
    return apiBase.axios.patch(`/user/${usuario.id}/`, {
      is_active: !usuario.is_active,
    })
  }

  getGestores() {
    return apiBase.axios.get(`/user/get_gestores/`)
  }

  getUserById(userId) {
    return apiBase.axios.get(`/user/${userId}/`)
  }
}
export default Service
