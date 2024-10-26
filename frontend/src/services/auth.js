import { Formaters } from '@/utils'

import { apiBase } from '../api/apiBase'

export class AuthService {
  static async getUserRegistered(username) {
    const response = await apiBase.axios.get('user/' + username)
    return response.data
  }

  static async getUserPermissions(token) {
    const permissions = (
      await apiBase.axios.get('permissions/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data

    return permissions
  }

  static async getMenus() {
    return (await apiBase.axios.get('menuitem/')).data
  }

  static async changeUserPassword({ cpf, username, password, userId }) {
    const payload = { cpf: Formaters.formatCPF(cpf), username, password }

    await apiBase.axios.post('user/update_password/', payload).then(() => {
      this.verifyUserSAJE(payload.username, String(userId))
    })
  }

  static async signIn({ username, password }) {
    const response = await apiBase.axios.post('login/', {
      username,
      password,
    })
    return response.data
  }

  static async signUp({ username, password, firstName, lastName }) {
    const user = (
      await apiBase.axios.post('user/', {
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      })
    ).data

    return user
  }
}
