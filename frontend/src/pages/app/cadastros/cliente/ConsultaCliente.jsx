import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useContext, useEffect, useState } from 'react'
import { IoPencil } from 'react-icons/io5'
import { toast } from 'sonner'

import { IconButton } from '@/components/buttons'
import { DeletePopup } from '@/components/dialogs/delete-popup'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { ClienteContext } from '@/context/ClienteContext'
import { useSGCNavigate } from '@/useNavigate'

import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import Service from './service'

export function ConsultaCliente() {
  const { setClienteId } = useContext(ClienteContext)
  const { navigate } = useSGCNavigate()
  const [filters, setFilters] = useState({ nome: '', gestor_id: null })
  const [gestores, setGestores] = useState([])
  const [clientes, setClientes] = useState([])
  const [inPromise, setInPromise] = useState(false)
  const service = new Service()

  useEffect(() => {
    service.getGestores().then(({ data }) => setGestores(data))
  }, [])

  const handleNavigateToEdit = (clienteId) => {
    setClienteId(clienteId)
    navigate(SGC_ROUTES.CADASTROS.CADASTRO_CLIENTE)
  }

  const handleFilterChange = (e, field) => {
    const value = e.target ? e.target.value : e.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  const search = () => {
    setInPromise(true)
    service
      .search(filters)
      .then(
        ({ data }) => setClientes(data),
        (error) =>
          toast.error(
            `Ocorreu um erro ao consultar os clientes. Erro: ${error}`
          )
      )
      .finally(() => setInPromise(false))
  }
  const deleteCliente = (clienteId) => {
    setInPromise(true)
    service
      .deleteCliente(clienteId)
      .then(
        () => {
          setClientes(clientes.filter((i) => i.id !== clienteId))
          toast.success('O cliente foi deletado com sucesso!')
        },
        (error) =>
          toast.error(`Ocorreu um erro ao deletar o cliente. Erro: ${error}`)
      )
      .finally(() => setInPromise(false))
  }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Cadastros', link: '/' },
          { label: 'Clientes', link: SGC_ROUTES.CADASTROS.CLIENTE },
        ]}
      >
        <div className="p-inputtext-sm my-6 flex flex-grow-0 flex-wrap">
          <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
            <Input
              value={filters.nome}
              onChange={(e) => handleFilterChange(e, 'nome')}
              type="text"
              className="w-full"
              label="Nome"
            />
          </div>
          <div className="mr-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
            <Select
              label="Gestor"
              className="mr-2 w-full"
              value={filters.gestor_id}
              onChange={(e) => handleFilterChange(e, 'gestor_id')}
              options={gestores}
              optionLabel="first_name"
              optionValue="id"
            />
          </div>

          <div className="md:w-1/24 mt-2 w-full sm:mt-2 sm:w-full md:mt-2 lg:mt-0 lg:w-1/6 xl:w-1/6 2xl:w-1/6">
            <IconButton
              onClick={search}
              icon="pi pi-search sgc-blue-icons-primary"
              className="p-button p-button-primary w-full"
            />
          </div>
        </div>

        <div className="grid">
          <div className="col">
            <Button
              size="small"
              label="Novo"
              className="mb-4 flex items-center justify-center gap-2 rounded-md border-none bg-sgc-green-primary p-2 py-1"
              onClick={() => navigate(SGC_ROUTES.CADASTROS.CADASTRO_CLIENTE)}
            >
              <i className="pi pi-plus"></i>
            </Button>
          </div>
        </div>

        <Divider className="my-2" />

        <Table
          paginator={true}
          value={clientes}
          isLoading={inPromise}
          columns={[
            {
              field: 'nome',
              header: 'Nome',
              className: '1/12 p-1',
            },
            {
              field: 'gestor_nome',
              header: 'Gestor',
              className: 'w-2/12 p-1',
            },
            {
              field: '',
              header: '',
              body: (item) => (
                <div className="flex h-6 justify-end gap-1 text-white">
                  <IconButton
                    containerHeight="h-6"
                    tooltip="Editar"
                    onClick={() => handleNavigateToEdit(item.id)}
                    iconComponent={<IoPencil size={18} />}
                    className="bg-sgc-blue-primary p-1"
                  />
                  <DeletePopup
                    feedbackMessage="Deseja realmente apagar o cliente"
                    itemLabel={item.nome}
                    onAccept={() => deleteCliente(item.id)}
                  />
                </div>
              ),
              className: '',
            },
          ]}
        ></Table>
      </Screen>
    </div>
  )
}
