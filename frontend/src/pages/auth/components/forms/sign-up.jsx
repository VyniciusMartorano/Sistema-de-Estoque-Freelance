import { Button } from 'primereact/button'

// import { useContext } from 'react'
// import { toast } from 'sonner'
import { Input, InputMask } from '@/components/input'
// import { AuthContext } from '@/context/AuthContext'
import { SGC_ROUTES } from '@/routes/navigation-routes'
import { useSGCNavigate } from '@/useNavigate'

export function SignUpForm() {
  // const { signUp } = useContext(AuthContext)
  const { navigate } = useSGCNavigate()

  // const handleSignUp = ({ cpf, password, username }) => {
  //   toast.promise(
  //     signUp({
  //       cpf,
  //       password,
  //       username,
  //     }),
  //     {
  //       loading: 'Validando acesso...',
  //       error: (e) => {
  //         if (e.message.response.status === 400) {
  //           return `Preencha todos os campos!`
  //         }
  //         if (e.message.response.status === 401) {
  //           return e
  //         }
  //       },
  //     }
  //   )
  // }

  const handleGoBack = () => {
    navigate(SGC_ROUTES.AUTH.LOGIN)
  }

  return (
    <div>
      <div className="flex flex-col gap-6 bg-white">
        <div className="flex flex-col gap-2">
          <InputMask
            label="CPF"
            mask="999.999.999-99"
            iconClassName="fas fa-address-card"
            // {...register('cpf')}
          />

          {/* {!!errors.cpf && (
            <span className="text-xs text-red-600">{errors.cpf.message}</span>
          )} */}
        </div>

        <div className="flex flex-col gap-2">
          <Input
            label="Usuário"
            iconClassName="pi pi-user"
            // {...register('username')}
          />

          {/* {!!errors.username && (
            <span className="text-xs text-red-600">
              {errors.username.message}
            </span>
          )} */}
        </div>

        <div className="flex flex-col gap-2">
          <Input
            label="Senha"
            type="password"
            iconClassName="pi pi-key"
            // {...register('password')}
          />

          {/* {!!errors.password && (
            <span className="text-xs text-red-600">
              {errors.password.message}
            </span>
          )} */}
        </div>

        <Input
          label="Confirmar senha"
          type="password"
          iconClassName="pi pi-key"
          // {...register('password')}
        />
      </div>

      <div className="my-4 rounded-lg bg-simas-gray-light p-4">
        <p className="text-center italic">
          Ao confirmar, o usuário concorda que o sigilo das informações
          cadastradas são exclusivamente de sua responsabilidade.
        </p>
      </div>

      <div>
        <Button
          label="Confirmar"
          type="submit"
          className="mx-auto block w-full rounded-none border-none bg-simas-blue-background-light outline-0"
        />

        <div className="my-4 h-[1px] w-full bg-simas-gray-label"></div>

        <Button
          label="Voltar para login"
          type="button"
          className="p-d-block p-mx-auto p-button-outlined w-full rounded-none outline-simas-blue-background-light"
          onClick={handleGoBack}
        />
      </div>
    </div>
  )
}
