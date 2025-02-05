import { Button } from 'primereact/button'
import { useContext, useEffect, useState } from 'react'
import { IoEye } from 'react-icons/io5'
import { toast } from 'sonner'

import { IconButton } from '@/components/buttons'
import { DeletePopup } from '@/components/dialogs/delete-popup'
import { Select } from '@/components/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { EstoqueContext } from '@/context/EstoqueContext'
import { useSGCNavigate } from '@/useNavigate'

import { InputCalendar } from '../../../../components/input/calendar'
import { AuthContext } from '../../../../context/AuthContext'
import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import { Formaters } from '../../../../utils/formaters'
import Service from './service'

export function ConsultaVenda() {
  const formatador = new Formaters()
  const { setVendaId } = useContext(EstoqueContext)
  const { userHavePermission, user } = useContext(AuthContext)
  const { navigate } = useSGCNavigate()
  const [filters, setFilters] = useState({
    de: new Date('2024-01-01 00:00:00'),
    ate: new Date(),
    cliente: null,
  })
  const [clientes, setClientes] = useState([])
  const [registros, setRegistros] = useState([])
  const [inPromise, setInPromise] = useState(false)
  const service = new Service()

  useEffect(() => {
    search()
    getClientes()
    setVendaId(null)
  }, [])

  const handleFilterChange = (e, field) => {
    const value = e.target ? e.target.value : e.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  const handleNavigateToEdit = (vendaId) => {
    setVendaId(vendaId)
    navigate(SGC_ROUTES.ESTOQUE.CADASTRO_VENDA)
  }
  const getClientes = () => {
    service.getClientes().then(
      ({ data }) => setClientes(data),
      () => {
        toast.error('Ocorreu um erro ao buscar os clientes!')
      }
    )
  }

  const search = () => {
    setInPromise(true)
    service
      .search({
        ...filters,
        de: formatador.formatDate(filters.de, 'YYYY-MM-DD') + ' 00:00:00',
        ate: formatador.formatDate(filters.ate, 'YYYY-MM-DD') + ' 23:59:59',
      })
      .then(
        ({ data }) => setRegistros(data),
        (error) => toast.error(`Ocorreu um erro ao consultar. Erro: ${error}`)
      )
      .finally(() => setInPromise(false))
  }

  const excluirVenda = (vendaId) => {
    service.excluirVenda(vendaId).then(
      () => {
        setRegistros(registros.filter((i) => i.id !== vendaId))
        toast.success('A venda foi excluída com sucesso!')
      },
      () => {
        toast.warning('Ocorreu um erro ao excluir a venda!')
      }
    )
  }

  const headerTable = (
    <div className="grid">
      <div className="col">
        {userHavePermission('VENDA_cadastrar_venda') && user.is_vendedor && (
          <Button
            size="small"
            label="Novo"
            className="md:w-1/24  flex w-full items-center justify-center gap-2 rounded-md border-none bg-sgc-green-primary p-2 py-1  sm:w-full   lg:w-1/6 xl:w-1/6 2xl:w-1/6"
            onClick={() => navigate(SGC_ROUTES.ESTOQUE.CADASTRO_VENDA)}
          >
            <i className="pi pi-plus"></i>
          </Button>
        )}
      </div>
    </div>
  )
  return (
    <div>
      <Screen itens={[{ label: 'Venda', link: SGC_ROUTES.ESTOQUE.VENDA }]}>
        <div className="p-inputtext-sm my-6 flex flex-grow-0 flex-wrap">
          <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
            <InputCalendar
              value={filters.de}
              onChange={(e) => handleFilterChange(e, 'de')}
              className="w-full"
              label="De"
            />
          </div>
          <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
            <InputCalendar
              value={filters.ate}
              onChange={(e) => handleFilterChange(e, 'ate')}
              className="w-full"
              label="Até"
            />
          </div>
          <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
            <Select
              label="Cliente"
              className="mr-2 w-full"
              filter
              value={filters.cliente}
              onChange={(e) => handleFilterChange(e, 'cliente')}
              options={clientes}
              optionLabel="nome"
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

        <Table
          paginator={true}
          header={headerTable}
          value={registros}
          isLoading={inPromise}
          columns={[
            {
              field: 'data',
              header: 'Data',
              className: '1/6 p-1',
              body: (item) => (
                <div className="flex h-6 justify-start gap-1 ">
                  {formatador.formatDate(item.data_venda)}
                </div>
              ),
            },
            {
              field: 'vendedor_label',
              header: 'Vendedor',
              className: 'w-2/6 p-1',
            },
            {
              field: 'cliente_label',
              header: 'Cliente',
              className: 'w-2/6 p-1',
            },
            {
              field: 'total_venda',
              header: 'Total',
              className: 'w-2/6 p-1',
              body: (item) => (
                <div className="flex h-6 justify-end gap-1 p-1">
                  {item.total_venda.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </div>
              ),
            },
            {
              field: '',
              header: '',
              body: (item) => (
                <div className="flex h-6 justify-end gap-1 text-white">
                  {userHavePermission('VENDA_visualizar_venda') && (
                    <IconButton
                      containerHeight="h-6"
                      tooltip="Visualizar"
                      onClick={() => handleNavigateToEdit(item.id)}
                      iconComponent={<IoEye size={18} />}
                      className="bg-sgc-blue-primary p-1"
                    />
                  )}
                  {userHavePermission('VENDA_excluir_venda') && (
                    <DeletePopup
                      feedbackMessage="Toda movimentação de estoque sera excluida, Deseja realmente excluir a venda?"
                      itemLabel={''}
                      onAccept={() => excluirVenda(item.id)}
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
