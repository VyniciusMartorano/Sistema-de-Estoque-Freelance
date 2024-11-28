import { Button } from 'primereact/button'
import { useContext, useEffect, useState } from 'react'
import { IoEye } from 'react-icons/io5'
import { toast } from 'sonner'

import { IconButton } from '@/components/buttons'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { EstoqueContext } from '@/context/EstoqueContext'
import { useSGCNavigate } from '@/useNavigate'

import { InputCalendar } from '../../../../components/input/calendar'
import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import { Formaters } from '../../../../utils/formaters'
import Service from './service'

export function ConsultaCI() {
  const formatador = new Formaters()
  const { setCiId } = useContext(EstoqueContext)
  const { navigate } = useSGCNavigate()
  const [filters, setFilters] = useState({
    de: new Date(),
    ate: new Date(),
    tipo: null,
    observacao: null,
  })
  const [registros, setRegistros] = useState([])
  const [inPromise, setInPromise] = useState(false)
  const service = new Service()
  const tipoEnum = {
    ENTRADA: 1,
    SAIDA: 2,
  }

  useEffect(() => {
    search()
    setCiId(null)
  }, [])

  const handleFilterChange = (e, field) => {
    const value = e.target ? e.target.value : e.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  const handleNavigateToEdit = (ciId) => {
    setCiId(ciId)
    navigate(SGC_ROUTES.CADASTROS.CADASTRO_PRODUTO)
  }

  const search = () => {
    setInPromise(true)
    service
      .search({
        ...filters,
        de: formatador.formatDate(filters.de, 'YYYY-MM-DD'),
        ate: formatador.formatDate(filters.ate, 'YYYY-MM-DD'),
      })
      .then(
        ({ data }) => setRegistros(data),
        (error) => toast.error(`Ocorreu um erro ao consultar. Erro: ${error}`)
      )
      .finally(() => setInPromise(false))
  }

  const headerTable = (
    <div className="grid">
      <div className="col">
        <Button
          size="small"
          label="Novo"
          className="md:w-1/24  flex w-full items-center justify-center gap-2 rounded-md border-none bg-sgc-green-primary p-2 py-1  sm:w-full   lg:w-1/6 xl:w-1/6 2xl:w-1/6"
          onClick={() => navigate(SGC_ROUTES.ESTOQUE.CADASTRO_CI)}
        >
          <i className="pi pi-plus"></i>
        </Button>
      </div>
    </div>
  )
  return (
    <div>
      <Screen itens={[{ label: 'CI', link: SGC_ROUTES.ESTOQUE.CI }]}>
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
          <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
            <Input
              value={filters.observacao}
              onChange={(e) => handleFilterChange(e, 'observacao')}
              type="text"
              className="w-full"
              label="Observação"
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
          header={headerTable}
          value={registros}
          isLoading={inPromise}
          columns={[
            {
              field: 'data',
              header: 'Data',
              className: '1/12 p-1',
            },
            {
              field: 'tipo',
              header: 'Tipo',
              className: 'w-2/12 p-1',
              body: (item) => (
                <div className="flex h-6 justify-end gap-1 ">
                  {item.tipo === tipoEnum.ENTRADA ? 'Entrada' : 'Saída'}
                </div>
              ),
            },
            {
              field: '',
              header: '',
              body: (item) => (
                <div className="flex h-6 justify-end gap-1 text-white">
                  <IconButton
                    containerHeight="h-6"
                    tooltip="Visualizar"
                    onClick={() => handleNavigateToEdit(item.id)}
                    iconComponent={<IoEye size={18} />}
                    className="bg-sgc-blue-primary p-1"
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
