import { Formaters } from '@/utils'

import { apiBase } from '../api/apiBase'

export class AuthService {
  static async getUserRegistered(username) {
    const response = await apiBase.get('user/' + username)
    return response.data
  }

  static async getUserPermissions(token) {
    const permissions = (
      await apiBase.get('permissions/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data

    return permissions
  }

  static async getMenus() {
    return (await apiBase.get('menuitem/')).data
  }

  static async changeUserPassword({ cpf, username, password, userId }) {
    const payload = { cpf: Formaters.formatCPF(cpf), username, password }

    await apiBase.post('user/update_password/', payload).then(() => {
      this.verifyUserSAJE(payload.username, String(userId))
    })
  }

  static async signIn({ username, password }) {
    const response = await apiBase.post('login/', {
      username,
      password,
    })
    return response.data
  }

  static async signUp({ username, password, firstName, lastName }) {
    const user = (
      await apiBase.post('user/', {
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      })
    ).data

    return user
  }

  static async getRegistryByCpf(cpf) {
    const registryByCpf = (await apiBase.get('user/get_user_by_cpf' + cpf)).data
      .matricula

    return registryByCpf
  }

  static async getUserData(token) {
    const user = (await apiBase.get('user/')).data

    const permissions = await AuthService.getUserPermissions(token)
    const menus = await AuthService.getMenus()

    user.user_permissions = permissions
    user.menus = menus

    return user
  }
}
