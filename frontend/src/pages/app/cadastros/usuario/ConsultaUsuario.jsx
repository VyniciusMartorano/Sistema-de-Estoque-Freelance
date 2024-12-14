import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { useContext, useEffect, useState } from 'react'
import { IoPencil } from 'react-icons/io5'
import { toast } from 'sonner'

import { IconButton } from '@/components/buttons'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { ClienteContext } from '@/context/ClienteContext'
import { useSGCNavigate } from '@/useNavigate'

import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import Service from './service'

export function ConsultaUsuario() {
  const { setUserId } = useContext(ClienteContext)
  const { navigate } = useSGCNavigate()
  const [filters, setFilters] = useState({ nome: '', tipo: null, ativo: 1 })
  const [usuarios, setUsuarios] = useState([])
  const [inPromise, setInPromise] = useState(false)
  const service = new Service()

  useEffect(() => {
    setUserId(null)
  }, [])

  const handleNavigateToEdit = (userId) => {
    setUserId(userId)
    navigate(SGC_ROUTES.CADASTROS.CADASTRO_USUARIO)
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
        ({ data }) => setUsuarios(data),
        (error) =>
          toast.error(
            `Ocorreu um erro ao consultar os usuarios. Erro: ${error}`
          )
      )
      .finally(() => setInPromise(false))
  }
  const inativeUser = (usuario) => {
    setInPromise(true)
    service
      .inativeUser(usuario)
      .then(
        () => {
          const refatored = usuarios.map((i) => {
            if (i.id === usuario.id) {
              i.is_active = !i.is_active
            }
            return i
          })
          setUsuarios(refatored)
        },
        (error) =>
          toast.error(`Ocorreu um erro ao atualizar o usuario. Erro: ${error}`)
      )
      .finally(() => setInPromise(false))
  }

  const headerTable = (
    <div className="grid">
      <div className="col">
        <Button
          size="small"
          label="Novo"
          className="flex w-full items-center justify-center gap-2 rounded-md border-none bg-sgc-green-primary p-2 py-1 sm:w-full lg:w-1/6 xl:w-1/6 2xl:w-1/6"
          onClick={() => navigate(SGC_ROUTES.CADASTROS.CADASTRO_USUARIO)}
        >
          <i className="pi pi-plus"></i>
        </Button>
      </div>
    </div>
  )

  return (
    <div>
      <Screen
        itens={[{ label: 'Usuarios', link: SGC_ROUTES.CADASTROS.USUARIO }]}
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
              label="Tipo"
              className="mr-2 w-full"
              value={filters.tipo}
              onChange={(e) => handleFilterChange(e, 'tipo')}
              options={[
                { label: 'Gestor', value: 1 },
                { label: 'Vendedor', value: 2 },
              ]}
              optionLabel="label"
              optionValue="value"
            />
          </div>
          <div className="mr-1 w-full sm:w-full md:w-3/6 lg:w-2/4 xl:w-1/5 ">
            <Select
              label="Ativo"
              className="mr-2 w-full"
              value={filters.ativo}
              showClear={false}
              onChange={(e) => handleFilterChange(e, 'ativo')}
              options={[
                { label: 'Ativo', value: 1 },
                { label: 'Inativo', value: '0' },
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
          value={usuarios}
          header={headerTable}
          isLoading={inPromise}
          columns={[
            {
              field: 'first_name',
              header: 'Nome',
              className: '1/12 p-1',
            },
            {
              field: 'tipo_label',
              header: 'Tipo',
              className: '1/12 p-1',
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
                  <Checkbox
                    onChange={() => inativeUser(item)}
                    checked={item.is_active}
                  ></Checkbox>
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
