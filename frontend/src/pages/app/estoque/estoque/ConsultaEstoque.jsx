import { InputText } from 'primereact/inputtext'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { IconButton } from '@/components/buttons'
import { Select } from '@/components/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { AuthContext } from '@/context/AuthContext'

import { InputCalendar } from '../../../../components/input/calendar'
import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import { Formaters } from '../../../../utils/formaters'
import Service from './service'

export function ConsultaEstoque() {
  const formatador = new Formaters()
  const [inPromiseSearchProduto, setinPromiseSearchProduto] = useState(false)
  const [produtos, setProdutos] = useState([])
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])

  const [filters, setFilters] = useState({
    de: new Date('2024-01-01 00:00:00'),
    ate: new Date(),
    tipo: null,
    produto: null,
    user: user.is_vendedor ? user.id : null,
  })
  const [registros, setRegistros] = useState([])
  const [inPromise, setInPromise] = useState(false)
  const service = new Service()
  const tipoEnum = {
    ENTRADA: 1,
    SAIDA: 2,
  }
  useEffect(() => {
    getProdutos()
    getUsers()
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

  const header = (
    <div className=" p-inputgroup flex-1 text-xs">
      <span className=" p-inputgroup-addon h-8">Saldo:</span>
      <InputText
        className="p-inputtext-sm h-8 text-right"
        disabled={true}
        value={registros
          .reduce((soma, item) => {
            if (item.tipo === tipoEnum.ENTRADA) {
              return soma + item.quantidade
            }
            return soma - item.quantidade
          }, 0)
          .toFixed(2)}
      />
    </div>
  )

  return (
    <div>
      <Screen itens={[{ label: 'Estoque', link: SGC_ROUTES.ESTOQUE.ESTOQUE }]}>
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
          <div className="mr-1 mt-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
            <Select
              label="Tipo"
              className="mr-2 w-full"
              value={filters.tipo}
              onChange={(e) => handleFilterChange(e, 'tipo')}
              options={[
                { label: 'Entrada', value: 1 },
                { label: 'Saída', value: 2 },
              ]}
              optionLabel="label"
              optionValue="value"
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
          header={header}
          isLoading={inPromise}
          columns={[
            {
              field: 'data',
              header: 'Data',
              className: '1/12 p-1',
              body: (item) => (
                <div className="flex h-6 justify-start gap-1 ">
                  {formatador.formatDate(item.data)}
                </div>
              ),
            },
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
              field: 'tipo',
              header: 'Tipo',
              className: 'w-1/12 p-1',
              body: (item) => (
                <div className="flex h-6 justify-start gap-1 p-1 ">
                  {item.tipo === tipoEnum.ENTRADA ? 'Entrada' : 'Saída'}
                </div>
              ),
            },
            {
              field: 'quantidade',
              header: 'Qtde',
              className: 'w-2/12 p-1',
              body: (item) => (
                <div className="flex h-6 justify-end gap-1 p-1 ">
                  {item.quantidade.toFixed(2)}
                </div>
              ),
            },
          ]}
        ></Table>
      </Screen>
    </div>
  )
}
