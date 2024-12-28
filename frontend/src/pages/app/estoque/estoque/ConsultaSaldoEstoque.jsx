import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { IconButton } from '@/components/buttons'
import { Select } from '@/components/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { AuthContext } from '@/context/AuthContext'

import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import Service from './service'

export function ConsultaSaldoEstoque() {
  const [inPromiseSearchProduto, setinPromiseSearchProduto] = useState(false)
  const [produtos, setProdutos] = useState([])
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [colunmsTable, setColunmsTable] = useState([
    {
      field: 'user_label',
      header: 'Usuario',
      className: '1/12 p-1',
    },
    {
      field: 'produto_label',
      header: 'Produto',
      className: '1/12 p-1',
    },
    {
      field: 'saldo',
      header: 'Saldo',
      className: 'w-2/12 p-1',
      body: (item) => (
        <div className="flex h-6 justify-end gap-1 p-1 ">
          {item.saldo.toFixed(2)}
        </div>
      ),
    },
  ])

  const [filters, setFilters] = useState({
    produto: null,
    user: user.is_vendedor ? user.id : null,
  })
  const [registros, setRegistros] = useState([])
  const [inPromise, setInPromise] = useState(false)
  const service = new Service()

  useEffect(() => {
    getProdutos()
    getUsers()

    if (user.is_vendedor) {
      setColunmsTable([
        {
          field: 'produto_label',
          header: 'Produto',
          className: '1/12 p-1',
        },
        {
          field: 'saldo',
          header: 'Saldo',
          className: 'w-2/12 p-1',
          body: (item) => (
            <div className="flex h-6 justify-end gap-1 p-1 ">
              {item.saldo.toFixed(2)}
            </div>
          ),
        },
      ])
    }
  }, [])

  const getProdutos = () => {
    setinPromiseSearchProduto(true)
    service
      .getProdutos()
      .then(
        ({ data }) => setProdutos(data),
        () => {
          toast.error('Ocorreu um erro ao buscar os produtos disponiveis!')
        }
      )
      .finally(() => setinPromiseSearchProduto(false))
  }
  const getUsers = () => {
    service.getUsers().then(
      ({ data }) => setUsers(data),
      () => {
        toast.error('Ocorreu um erro ao buscar os usuarios!')
      }
    )
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
      .searchSaldos(filters)
      .then(
        ({ data }) => setRegistros(data),
        (error) => toast.error(`Ocorreu um erro ao consultar. Erro: ${error}`)
      )
      .finally(() => setInPromise(false))
  }

  return (
    <div>
      <Screen
        itens={[
          {
            label: 'Saldo de Estoque',
            link: SGC_ROUTES.ESTOQUE.SALDO_DE_ESTOQUE,
          },
        ]}
      >
        <div className="p-inputtext-sm my-6 flex flex-grow-0 flex-wrap">
          {!user.is_vendedor && (
            <div className="mr-1 mt-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
              <Select
                label="Usuario"
                className="mr-2 w-full"
                value={filters.user}
                onChange={(e) => handleFilterChange(e, 'user')}
                options={users}
                optionLabel="label"
                optionValue="id"
                filter
              />
            </div>
          )}
          <div className="mr-1 mt-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
            <Select
              label="Produto"
              className="mr-2 w-full"
              value={filters.produto}
              onChange={(e) => handleFilterChange(e, 'produto')}
              options={produtos}
              optionLabel="label"
              optionValue="id"
              loading={inPromiseSearchProduto}
              filter
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
          value={registros}
          isLoading={inPromise}
          columns={colunmsTable}
        ></Table>
      </Screen>
    </div>
  )
}
