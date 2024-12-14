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

import { InputMask } from '../../../../components/input/input-mask'
import isEmpty from '../../../../utils/isEmpty'
import Service from './service'

export function CadastroCliente() {
  const { clienteId } = useContext(ClienteContext)
  const { navigate } = useSGCNavigate()

  const [cliente, setCliente] = useState({
    nome: '',
    gestor: null,
    endereco: '',
    telefone: '',
    email: '',
  })
  const service = new Service()
  const [gestores, setGestores] = useState([])
  const [inPromiseSave, setInPromiseSave] = useState(false)

  const handleFieldChange = (e, field) => {
    const value = e.target ? e.target.value : e.value
    setCliente((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  useEffect(() => {
    service.getGestores().then(({ data }) => setGestores(data))

    if (!clienteId) return

    service.getClienteById(clienteId).then(
      ({ data }) => setCliente(data),
      () => {
        toast.error('Ocorreu um erro ao buscar o cliente selecionado!')
      }
    )
  }, [])

  const payloadIsValid = (payload) => {
    if (isEmpty(payload)) {
      toast.warning('Preencha os campos vazios e tente novamente!')
      return false
    }
    return true
  }

  const saveOrUpdate = () => {
    if (!payloadIsValid(cliente)) return

    setInPromiseSave(true)
    service
      .saveOrUpdate(cliente)
      .then(
        ({ data }) => {
          setCliente(data)
          toast.success('O cliente foi salvo com sucesso!')
        },
        () => toast.error('Ocorreu um erro ao salvar os dados.')
      )
      .finally(() => setInPromiseSave(false))
  }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Clientes', link: SGC_ROUTES.CADASTROS.ALMOXARIFADO },
          {
            label: 'Cadastro',
            link: SGC_ROUTES.CADASTROS.CADASTRO_CLIENTE,
          },
        ]}
      >
        <div>
          <div className="p-inputtext-sm my-6 flex flex-grow-0 flex-wrap">
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <Input
                value={cliente.nome}
                onChange={(e) => handleFieldChange(e, 'nome')}
                type="text"
                className="w-full"
                label="Nome"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <Input
                value={cliente.email}
                onChange={(e) => handleFieldChange(e, 'email')}
                type="text"
                className="w-full"
                label="Email"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <Input
                value={cliente.endereco}
                onChange={(e) => handleFieldChange(e, 'endereco')}
                type="text"
                className="w-full"
                label="Endereço"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <InputMask
                value={cliente.telefone}
                onChange={(e) => handleFieldChange(e, 'telefone')}
                mask="(99) 9 9999-9999"
                placeholder="(99) 9 9999-9999"
                unmask={true}
                className="w-full"
                label="Telefone"
              />
            </div>
            <div className="mr-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
              <Select
                label="Gestor"
                className="mr-2 w-full"
                value={cliente.gestor}
                onChange={(e) => handleFieldChange(e, 'gestor')}
                options={gestores}
                optionLabel="first_name"
                optionValue="id"
              />
            </div>
          </div>

          <div className="mt-5 flex w-full flex-row justify-start gap-2">
            <ButtonSGC
              label="Voltar"
              bgColor="sgc-blue-primary"
              icon="pi pi-arrow-left"
              type="button"
              className="h-7"
              onClick={() => navigate(SGC_ROUTES.CADASTROS.CLIENTE)}
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
