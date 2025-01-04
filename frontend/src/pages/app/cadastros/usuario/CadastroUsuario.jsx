// import { useContext, useEffect, useState } from 'react'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ButtonSGC } from '@/components/buttons'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { ClienteContext } from '@/context/ClienteContext'
import { SGC_ROUTES } from '@/routes/navigation-routes'
import { useSGCNavigate } from '@/useNavigate'

import { AuthContext } from '../../../../context/AuthContext'
import isEmpty from '../../../../utils/isEmpty'
import Service from './service'

export function CadastroUsuario() {
  const { userId } = useContext(ClienteContext)
  const { userHavePermission } = useContext(AuthContext)
  const { navigate } = useSGCNavigate()

  const [user, setUser] = useState({
    id: null,
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    is_gerente: null,
    is_vendedor: null,
    tipo: null,
  })
  const tipoEnum = {
    GESTOR: 1,
    VENDEDOR: 2,
  }
  const service = new Service()
  const [gestores, setGestores] = useState([])
  const [tipos, setTipos] = useState([{ label: 'Vendedor', value: 2 }])
  const [inPromiseSave, setInPromiseSave] = useState(false)

  const handleFieldChange = (e, field) => {
    const value = e.target ? e.target.value : e.value

    setUser((prevFilters) => ({
      ...prevFilters,
      [field]: value,
      is_gerente:
        field === 'tipo' && value === tipoEnum.GESTOR
          ? 1
          : field === 'tipo'
            ? 0
            : prevFilters.is_gerente,
      is_vendedor:
        field === 'tipo' && value === tipoEnum.VENDEDOR
          ? 1
          : field === 'tipo'
            ? 0
            : prevFilters.is_vendedor,

      gestor:
        field === 'tipo' && value === tipoEnum.GESTOR
          ? null
          : field === 'gestor'
            ? value
            : prevFilters.gestor,
    }))
  }

  useEffect(() => {
    service.getGestores().then(({ data }) => setGestores(data))

    if (userHavePermission('USUARIO_criar_gestor')) {
      setTipos([
        { label: 'Gestor', value: 1 },
        { label: 'Vendedor', value: 2 },
      ])
    }

    if (!userId) return

    service.getUserById(userId).then(
      ({ data }) => {
        setUser({
          ...data,
          tipo: data.is_gerente ? tipoEnum.GESTOR : tipoEnum.VENDEDOR,
        })
      },
      () => {
        toast.error('Ocorreu um erro ao buscar o user selecionado!')
      }
    )
  }, [])

  const payloadIsValid = (payload) => {
    if (payload.tipo === tipoEnum.GESTOR) {
      delete payload.gestor
    }
    if (
      isEmpty(
        payload,
        ['is_gerente', 'is_vendedor', 'last_name', 'id', 'is_active'],
        true
      )
    ) {
      toast.warning('Preencha os campos vazios e tente novamente!')
      return false
    }
    if (payload.username.includes(' ')) {
      toast.warning('O nome de usuario não pode conter espaços!')
      return false
    }
    if (payload.is_vendedor && payload.is_gerente) {
      toast.warning('Você precisa definir o tipo de usuario!')
      return false
    }
    if (payload.password !== payload.password_repeat) {
      toast.warning('As senhas não são iguais!')
      return false
    }
    return true
  }

  const saveOrUpdate = () => {
    if (!payloadIsValid(user)) return

    setInPromiseSave(true)
    service
      .saveOrUpdate(user, user.id)
      .then(
        () => {
          toast.success('O usuario foi salvo com sucesso!')
          navigate(SGC_ROUTES.CADASTROS.USUARIO)
        },
        (error) =>
          toast.error(
            error.response?.data || 'Ocorreu um erro ao salvar os dados.'
          )
      )
      .finally(() => setInPromiseSave(false))
  }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Usuarios', link: SGC_ROUTES.CADASTROS.USUARIO },
          {
            label: 'Cadastro',
            link: SGC_ROUTES.CADASTROS.CADASTRO_USUARIO,
          },
        ]}
      >
        <div>
          <div className="p-inputtext-sm my-6 flex flex-grow-0 flex-wrap">
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <Input
                disabled={user.id}
                value={user.username}
                onChange={(e) => handleFieldChange(e, 'username')}
                type="text"
                className="w-full"
                label="Usuario"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <Input
                value={user.first_name}
                onChange={(e) => handleFieldChange(e, 'first_name')}
                type="text"
                className="w-full"
                label="Nome"
              />
            </div>
            {userHavePermission('USUARIO_redefinir_senha') && (
              <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
                <Input
                  value={user.password}
                  onChange={(e) => handleFieldChange(e, 'password')}
                  type="password"
                  className="w-full"
                  label="Senha"
                />
              </div>
            )}
            {userHavePermission('USUARIO_redefinir_senha') && (
              <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
                <Input
                  value={user.password_repeat}
                  onChange={(e) => handleFieldChange(e, 'password_repeat')}
                  type="password"
                  className="w-full"
                  label="Repetir Senha"
                />
              </div>
            )}

            <div className="mr-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
              <Select
                disabled={user.id}
                label="Tipo"
                className="mr-2 w-full"
                value={user.tipo}
                onChange={(e) => handleFieldChange(e, 'tipo')}
                options={tipos}
                showClear={false}
                optionLabel="label"
                optionValue="value"
              />
            </div>
            {user.tipo === 2 && (
              <div className="mr-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
                <Select
                  disabled={user.id}
                  label="Gestor"
                  className="mr-2 w-full"
                  value={user.gestor}
                  onChange={(e) => handleFieldChange(e, 'gestor')}
                  options={gestores}
                  optionLabel="first_name"
                  optionValue="id"
                />
              </div>
            )}
          </div>

          <div className="mt-5 flex w-full flex-row justify-start gap-2">
            <ButtonSGC
              label="Voltar"
              bgColor="sgc-blue-primary"
              icon="pi pi-arrow-left"
              type="button"
              className="h-7"
              onClick={() => navigate(SGC_ROUTES.CADASTROS.USUARIO)}
            />
            <ButtonSGC
              disabled={inPromiseSave}
              label="Salvar"
              className="h-7"
              icon="pi pi-check"
              onClick={saveOrUpdate}
              bgColor="sgc-green-primary"
              type="submit"
            />
          </div>
        </div>
      </Screen>
    </div>
  )
}
