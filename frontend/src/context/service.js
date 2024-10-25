import { apiBase } from '@/api/apibase'

class Service {
  getUser() {
    return apiBase.axios.get(`api/user/`)
  }

  getUserRegistered(username) {
    return apiBase.axios.get(`api/get_user/${username}`)
  }

  signIn(payload) {
    return apiBase.axios.post(`api/token/`, payload)
  }

  changeUserPassword(payload) {
    return apiBase.axios.post(`api/reset_passworrd/`, payload)
  }
}
export default Service
