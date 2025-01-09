import { apiBase } from "@/api/apiBase";

class Service {
  getVendedores() {
    return apiBase.axios.post(`/user/search/`, { ativo: 1, tipo: 2 });
  }

  search(payload) {
    return apiBase.axios.post(`/cliente/search/`, { ...payload });
  }

  saveOrUpdate(payload) {
    return apiBase.axios[payload.id ? "put" : "post"](
      `/cliente/${payload.id ? payload.id + "/" : ""}`,
      payload,
    );
  }

  deleteCliente(clienteId) {
    return apiBase.axios.delete(`/cliente/${clienteId}/`);
  }

  getClienteById(clienteId) {
    return apiBase.axios.get(`/cliente/${clienteId}/`);
  }
}
export default Service;
