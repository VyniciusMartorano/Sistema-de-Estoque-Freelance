import { CORE_URLS } from '@/api/constants/domain/core'
import { coreApi } from '@/api/core'
import { User } from '@/models/User'
import { Formaters } from '@/utils'


export class AuthService {
  static async getUserRegistered(username) {
    const response = await coreApi.get(
      CORE_URLS.USER_REGISTERED_BY_REGISTRY.replace('$matricula', username)
    )

    return response.data
  }

  static async getUserPermissions(token){
    const permissions = (
      await coreApi.get(CORE_URLS.GET_USER_PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data

    return permissions
  }

  static async getMenus() {
    const menus = (await coreApi.get(CORE_URLS.GET_MENUS)).data

    return menus
  }



  static async changeUserPassword({
    cpf,
    username,
    password,
    userId,
  }) {
    const payload = { cpf: Formaters.formatCPF(cpf), username, password }

    await coreApi.post(CORE_URLS.UPDATE_PASSWORD, payload).then(() => {
      this.verifyUserSAJE(payload.username, String(userId))
    })
  }

  static async signIn({
    username,
    password,
  }) {
    const response = await coreApi.post<SignInResponseData>(CORE_URLS.LOGIN, {
      username,
      password,
    })
    return response.data
  }

  static async signUp({
    username,
    password,
    firstName,
    lastName,
  }){
    const user = (
      await coreApi.post(CORE_URLS.REGISTER_USER, {
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      })
    ).data

    return user
  }

  static async getEmployeeByRegistry(username) {
    const employee = (
      await coreApi.get(
        CORE_URLS.GET_EMPLOYEE_BY_REGISTRY.replace('$matricula', username)
      )
    ).data

    return employee
  }

  static async getRegistryByCpf(cpf) {
    const registryByCpf = (
      await coreApi.get(
        CORE_URLS.GET_REGISTRY_BY_CPF.replace('$cpf', Formaters.formatCPF(cpf))
      )
    ).data.matricula

    return registryByCpf
  }

  static async getUserData(token) {
    const user = (await coreApi.get<User>(CORE_URLS.GET_USER)).data

    const permissions = await AuthService.getUserPermissions(token)
    const menus = await AuthService.getMenus()

    user.user_permissions = permissions
    user.menus = menus

    return user
  }
}
