const SGC_ROUTES = {
  APP: {
    HOME: '/homepage',
  },
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/cadastro',
  },
  ESTOQUE: {
    VENDA: '/estoque/vendas',
    CADASTRO_VENDA: '/estoque/vendas/cadastro',
    EXTRATO_ESTOQUE: '/estoque/extrato',
    SALDO_DE_ESTOQUE: '/estoque/saldos',
    CI: '/estoque/ci',
    CADASTRO_CI: '/estoque/ci/cadastro',
  },
  CADASTROS: {
    USUARIO: '/usuarios',
    CADASTRO_USUARIO: '/usuarios/cadastro',
    CLIENTE: '/clientes',
    CADASTRO_CLIENTE: '/clientes/cadastro',
    PRODUTO: '/produtos',
    CADASTRO_PRODUTO: '/produtos/cadastro',
  },
}
export { SGC_ROUTES }
