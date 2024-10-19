import { SGC_ROUTES } from '../navigation-routes'

import { AppLayout } from '@/pages/_layouts'
import { HomeScreen } from '@/pages/app/home'
import { CadastroAlmoxarifado } from '../../pages/app/cadastros/almoxarifado/CadastroAlmoxarifado'
import { ConsultaAlmoxarifado } from '../../pages/app/cadastros/almoxarifado/ConsultaAlmoxarifado'



export const privateRoutes = {
  path: '/',
  element: <AppLayout />,
  children: [
    {
      path: SGC_ROUTES.APP.HOME,
      element: <HomeScreen />,
    },
    {
      path: SGC_ROUTES.CADASTROS.ALMOXARIFADO,
      element: <CadastroAlmoxarifado />,
    },
    {
      path: SGC_ROUTES.CADASTROS.CADASTRO_ALMOXARIFADO,
      element: <ConsultaAlmoxarifado />,
    }
  ],
}
