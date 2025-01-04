import { Button } from 'primereact/button'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Input } from '@/components/input'
import { AuthContext } from '@/context/AuthContext'
// import { SGC_ROUTES } from '@/routes/navigation-routes'
// import { useSGCNavigate } from '@/useNavigate'

export function SignInForm() {
  const { register, handleSubmit } = useForm()

  const { signIn } = useContext(AuthContext)

  // const { navigate } = useSGCNavigate()

  const handleSignIn = (data) => {
    toast.promise(
      signIn({ username: data.username, password: data.password }),
      {
        duration: 1000,
        loading: 'Validando acesso...',
        error: (e) => {
          console.log(e)
          if (e.message.status === 401) return 'Usuario ou senha não coincidem'
          else return 'Ocorreu um erro ao fazer login'
        },
        success: 'Usuário autenticado com sucesso!',
      }
    )
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(handleSignIn)}>
      <div className="gap- flex flex-col bg-white">
        <p className="my-2 w-full text-center">SISTEMA DE GESTÃO CORPORATIVA</p>

        <Input
          label="Usuário"
          iconClassName="pi pi-user"
          {...register('username')}
        />

        <Input
          label="Senha"
          type="password"
          iconClassName="pi pi-key"
          {...register('password')}
        />
      </div>

      <div className="mt-7">
        <Button
          label="Acessar"
          type="submit"
          className="mx-auto block w-full rounded-none border-none bg-sgc-blue-background-light outline-0"
        />

        {/* <div className="my-4 h-[1px] w-full bg-sgc-gray-label"></div>
        <Button
          label="Cadastrar Usuário"
          type="button"
          className="p-d-block p-mx-auto p-button-outlined w-full rounded-none outline-sgc-blue-background-light"
          onClick={() => navigate(SGC_ROUTES.AUTH.SIGNUP)}
        /> */}
      </div>
    </form>
  )
}
