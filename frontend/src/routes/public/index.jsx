
import { AuthLayout } from '@/pages/_layouts'
import { SignInScreen, SignUpScreen } from '@/pages/auth'
import { SGC_ROUTES } from '@/routes/navigation-routes'

export const publicRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: SGC_ROUTES.AUTH.LOGIN,
      element: <SignInScreen />,
    },
    {
      path: SGC_ROUTES.AUTH.SIGNUP,
      element: <SignUpScreen />,
    },
  ],
}
