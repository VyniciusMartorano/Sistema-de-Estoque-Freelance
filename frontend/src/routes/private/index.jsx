import { AppLayout } from '@/pages/_layouts'
import { HomeScreen } from '@/pages/app/home'

import { ConsultaCliente } from '../../pages/app/cadastros/cliente/ConsultaCliente'
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
    // {
    //   path: SGC_ROUTES.CADASTROS.CADASTRO_CLIENTE,
    //   element: <CadastroCliente />,
    // },
  ],
}
