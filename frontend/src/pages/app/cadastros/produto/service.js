import { apiBase } from "@/api/apiBase";

class Service {
  search(query) {
    return apiBase.axios.get(`/produto/search/?query=${query}`);
  }

  saveOrUpdate(payload, produtoId) {
    return apiBase.axios[produtoId ? "put" : "post"](
      `/produto/${produtoId ? produtoId + "/" : ""}`,
      payload,
      { headers: { "Content-Type": `multipart/form-data` } },
    );
  }

  deleteProduto(produtoId) {
    return apiBase.axios.delete(`/produto/${produtoId}/`);
  }

  getProdutoById(produtoId) {
    return apiBase.axios.get(`/produto/${produtoId}/`);
  }
}
export default Service;
