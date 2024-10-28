import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useContext, useState } from 'react'
import { IoPencil } from 'react-icons/io5'

import { IconButton } from '@/components/buttons'
import { DeletePopup } from '@/components/dialogs/delete-popup'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { COLORS_TAG, Tag } from '@/components/tag/Tag'
import { AlmoxarifadoContext } from '@/context/AlmoxarifadoContext'
import { useSGCNavigate } from '@/useNavigate'

import { SGC_ROUTES } from '../../../../routes/navigation-routes'

export function ConsultaCliente() {
  const { setAlmoxarifadoId } = useContext(AlmoxarifadoContext)
  const { navigate } = useSGCNavigate()
  const [filters, setFilters] = useState({ nome: '', gestor_id: null })

  const handleNavigateToEdit = (almoxarifadoId) => {
    setAlmoxarifadoId(almoxarifadoId)
    navigate(SGC_ROUTES.CADASTROS.CADASTRO_ALMOXARIFADO)
  }

  const handleFilterChange = (e, field) => {
    const value = e.target ? e.target.value : e.value
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Cadastros', link: '/' },
          { label: 'Clientes', link: SGC_ROUTES.CADASTROS.CLIENTE },
        ]}
      >
        <div className="p-inputtext-sm my-6 flex">
          <div className="mr-1 w-1/5">
            <Input
              value={filters.nome}
              onChange={(e) => handleFilterChange(e, 'nome')}
              type="text"
              className="w-full"
              label="Nome"
            />
          </div>
          <div className="mr-1 w-1/5">
            <Select
              label="Gestor"
              className="mr-2 w-full"
              value={filters.gestor_id}
              onChange={(e) => handleFilterChange(e, 'gestor_id')}
              options={[
                { value: 1, label: 'Interno' },
                { value: 2, label: 'Externo' },
              ]}
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <div className="w-1/24">
            <IconButton
              icon="pi pi-search sgc-blue-icons-primary"
              className="p-button p-button-primary w-full"
            />
          </div>
        </div>

        {/* Botão "Novo" */}
        <div className="grid">
          <div className="col">
            <Button
              size="small"
              label="Novo"
              className="mb-4 flex items-center justify-center gap-2 rounded-md border-none bg-sgc-green-primary p-2 py-1"
              onClick={() =>
                navigate(SGC_ROUTES.CADASTROS.CADASTRO_ALMOXARIFADO)
              }
            >
              <i className="pi pi-plus"></i>
            </Button>
          </div>
        </div>

        <Divider className="my-2" />

        {/* Tabela */}
        <Table
          paginator={true}
          allowExpansion
          onRowToggle={(e) => console.log(e.data)}
          columns={[
            {
              field: 'descricao',
              header: 'Descrição',
              className: '1/12 p-1',
            },
            {
              field: 'tipo',
              header: 'Tipo',
              className: 'w-2/12 p-1',
              body: (data) => (
                <Tag
                  label={data.tipo === 1 ? 'Interno' : 'Externo'}
                  color={data.tipo === 1 ? COLORS_TAG.GREEN : COLORS_TAG.BLUE}
                />
              ),
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
                    feedbackMessage="Deseja realmente apagar o almoxarifado"
                    itemLabel={item.descricao}
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
