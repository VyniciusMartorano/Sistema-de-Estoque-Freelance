import { apiBase } from "@/api/apiBase";

class Service {
  getUser() {
    return apiBase.axios.get(`/user/`);
  }

  getMenus() {
    return apiBase.axios.get(`/menuitem/`);
  }

  async getPermissions() {
    return await apiBase.axios.get("permissions/");
  }

  getUserRegistered(username) {
    return apiBase.axios.get(`/get_user/${username}`);
  }

  async signIn(payload) {
    return await apiBase.axios.post(`/token/`, payload);
  }

  changeUserPassword(payload) {
    return apiBase.axios.post(`/reset_passworrd/`, payload);
  }
}
export default Service;
