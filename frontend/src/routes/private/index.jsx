import { AppLayout } from '@/pages/_layouts'
import { HomeScreen } from '@/pages/app/home'
import {
  CategoriaScreen,
  EmbalagemScreen,
} from '@/pages/app/qualidade/cadastros'
import { SGC_ROUTES } from '@/routes/navigation-routes'



export const privateRoutes = {
  path: '/',
  element: <AppLayout />,
  children: [
    {
      path: SGC_ROUTES.APP.HOME,
      element: <HomeScreen />,
    },
    {
      path: SGC_ROUTES.,
      element: <CategoriaScreen />,
    },
    {
      path: SGC_ROUTES.QUALIDADE.CADASTROS.EMBALAGEM,
      element: <EmbalagemScreen />,
    }
  ],
}
