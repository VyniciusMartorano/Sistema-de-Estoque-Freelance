import { Button } from 'primereact/button'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Input } from '@/components/input'
import { AuthContext } from '@/context/AuthContext'
import { SGC_ROUTES } from '@/routes/navigation-routes'
import { useSGCNavigate } from '@/useNavigate'

export function SignInForm() {
  const { register, handleSubmit } = useForm()

  const { signIn } = useContext(AuthContext)

  const { navigate } = useSGCNavigate()

  const handleSignIn = (data) => {
    toast.promise(
      signIn({ username: data.username, password: data.password }),
      {
        duration: 1000,
        loading: 'Validando acesso...',
        error: (e) => {
          console.log(e)
          if (e.message.response.status === 400) {
            return `Preencha todos os campos!`
          }
          if (e.message.response.status === 401) {
            return 'Usuário e senha não coincidem!'
          }
        },
        success: 'Usuário autenticado com sucesso!',
      }
    )
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(handleSignIn)}>
      <div className="flex flex-col gap-6 bg-white">
        <p className="my-4 w-full text-center">SISTEMA DE GESTÃO CORPORATIVA</p>

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

      <div className="mt-12">
        <Button
          label="Acessar"
          type="submit"
          className="bg-sgc-blue-background-light mx-auto block w-full rounded-none border-none outline-0"
        />

        <div className="bg-sgc-gray-label my-4 h-[1px] w-full"></div>

        <Button
          label="Cadastrar Usuário"
          type="button"
          className="p-d-block p-mx-auto p-button-outlined outline-sgc-blue-background-light w-full rounded-none"
          onClick={() => navigate(SGC_ROUTES.AUTH.SIGNUP)}
        />
      </div>
    </form>
  )
}
