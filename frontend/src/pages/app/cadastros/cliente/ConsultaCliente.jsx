import { Button } from 'primereact/button'
import { useContext, useEffect, useState } from 'react'
import { IoPencil } from 'react-icons/io5'
import { toast } from 'sonner'

import { IconButton } from '@/components/buttons'
import { DeletePopup } from '@/components/dialogs/delete-popup'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { AuthContext } from '@/context/AuthContext'
import { ClienteContext } from '@/context/ClienteContext'
import { useSGCNavigate } from '@/useNavigate'

import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import Service from './service'

export function ConsultaCliente() {
  const { setClienteId } = useContext(ClienteContext)
  const { navigate } = useSGCNavigate()
  const [gestores, setVendedores] = useState([])
  const [clientes, setClientes] = useState([])
  const { user, userHavePermission } = useContext(AuthContext)
  const [inPromise, setInPromise] = useState(false)
  const service = new Service()
  const [filters, setFilters] = useState({
    nome: '',
    vendedor_id: user.is_vendedor ? user.id : null,
  })

  useEffect(() => {
    setClienteId(null)
    service.getVendedores().then(({ data }) => setVendedores(data))
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
  const headerTable = (
    <div className="grid">
      <div className="col">
        {userHavePermission('CLIENTE_cadastrar_cliente') && (
          <Button
            size="small"
            label="Novo"
            className="flex w-full items-center justify-center gap-2 rounded-md border-none bg-sgc-green-primary p-2 py-1 sm:w-full lg:w-1/6 xl:w-1/6 2xl:w-1/6"
            onClick={() => navigate(SGC_ROUTES.CADASTROS.CADASTRO_CLIENTE)}
          >
            <i className="pi pi-plus"></i>
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <Screen
        itens={[{ label: 'Clientes', link: SGC_ROUTES.CADASTROS.CLIENTE }]}
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
          {!user.is_vendedor && (
            <div className="mr-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
              <Select
                label="Vendedor"
                className="mr-2 w-full"
                value={filters.vendedor_id}
                onChange={(e) => handleFilterChange(e, 'vendedor_id')}
                options={gestores}
                optionLabel="first_name"
                optionValue="id"
              />
            </div>
          )}

          <div className="md:w-1/24 mt-2 w-full sm:mt-2 sm:w-full md:mt-2 lg:mt-0 lg:w-1/6 xl:w-1/6 2xl:w-1/6">
            <IconButton
              onClick={search}
              icon="pi pi-search sgc-blue-icons-primary"
              className="p-button p-button-primary w-full"
            />
          </div>
        </div>

        <Table
          paginator={true}
          value={clientes}
          header={headerTable}
          isLoading={inPromise}
          columns={[
            {
              field: 'nome',
              header: 'Nome',
              className: '1/12 p-1',
            },
            {
              field: 'vendedor_nome',
              header: 'Vendedor',
              className: 'w-2/12 p-1',
            },
            {
              field: '',
              header: '',
              body: (item) => (
                <div className="flex h-6 justify-end gap-1 text-white">
                  {userHavePermission('CLIENTE_editar_cliente') && (
                    <IconButton
                      containerHeight="h-6"
                      tooltip="Editar"
                      onClick={() => handleNavigateToEdit(item.id)}
                      iconComponent={<IoPencil size={18} />}
                      className="bg-sgc-blue-primary p-1"
                    />
                  )}
                  {userHavePermission('CLIENTE_excluir_cliente') && (
                    <DeletePopup
                      feedbackMessage="Deseja realmente apagar o cliente"
                      itemLabel={item.nome}
                      onAccept={() => deleteCliente(item.id)}
                    />
                  )}
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
