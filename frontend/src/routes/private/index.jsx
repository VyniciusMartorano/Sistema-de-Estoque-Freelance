import { AppLayout } from '@/pages/_layouts'
import { HomeScreen } from '@/pages/app/home'

import { CadastroCliente } from '../../pages/app/cadastros/cliente/CadastroCliente'
import { ConsultaCliente } from '../../pages/app/cadastros/cliente/ConsultaCliente'
import { CadastroProduto } from '../../pages/app/cadastros/produto/CadastroProduto'
import { ConsultaProduto } from '../../pages/app/cadastros/produto/ConsultaProduto'
import { SGC_ROUTES } from '../navigation-routes'

export const privateRoutes = {
  path: '/',
  element: <AppLayout />,
  children: [
    {
      path: SGC_ROUTES.APP.HOME,
      element: <HomeScreen />,
    },
    {
      path: SGC_ROUTES.CADASTROS.CLIENTE,
      element: <ConsultaCliente />,
    },
    {
      path: SGC_ROUTES.CADASTROS.CADASTRO_CLIENTE,
      element: <CadastroCliente />,
    },
    {
      path: SGC_ROUTES.CADASTROS.PRODUTO,
      element: <ConsultaProduto />,
    },
    {
      path: SGC_ROUTES.CADASTROS.CADASTRO_PRODUTO,
      element: <CadastroProduto />,
    },
  ],
}
