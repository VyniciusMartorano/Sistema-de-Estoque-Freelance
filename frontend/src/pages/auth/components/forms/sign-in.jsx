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
          if (e.response) {
            if (e.response.status === 401) {
              // Lógica para o erro 401 Unauthorized
              console.log(
                'Erro 401: Não autorizado. Redirecionando para login...'
              )
              // Exemplo: redirecionar para a página de login
              window.location.href = '/login'
            } else {
              // Lógica para outros status de erro
              console.log(`Erro ${e.response.status}:`, e.response.data)
            }
          } else if (e.request) {
            // O pedido foi feito, mas não houve resposta
            console.log('Nenhuma resposta recebida:', e.request)
          } else {
            // Algum outro erro ocorreu ao configurar a requisição
            console.log('Erro ao configurar a requisição:', e.message)
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
          className="mx-auto block w-full rounded-none border-none bg-sgc-blue-background-light outline-0"
        />

        <div className="my-4 h-[1px] w-full bg-sgc-gray-label"></div>

        <Button
          label="Cadastrar Usuário"
          type="button"
          className="p-d-block p-mx-auto p-button-outlined w-full rounded-none outline-sgc-blue-background-light"
          onClick={() => navigate(SGC_ROUTES.AUTH.SIGNUP)}
        />
      </div>
    </form>
  )
}
