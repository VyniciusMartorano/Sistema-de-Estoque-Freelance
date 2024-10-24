import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useContext, useEffect } from 'react'
import { IoPencil } from 'react-icons/io5'

// import { toast } from 'sonner'
import { IconButton } from '@/components/buttons'
import { DeletePopup } from '@/components/dialogs/delete-popup'
// import { Select } from '@/components/input'
// import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { COLORS_TAG, Tag } from '@/components/tag/Tag'
import { AlmoxarifadoContext } from '@/context/AlmoxarifadoContext'
import { useSGCNavigate } from '@/useNavigate'

import { SGC_ROUTES } from '../../../../routes/navigation-routes'

export function ConsultaAlmoxarifado() {
  const { setAlmoxarifadoId } = useContext(AlmoxarifadoContext)
  const { navigate } = useSGCNavigate()
  // const [expandedRows, setExpandedRows] = useState<unknown[]>([])

  useEffect(() => {
    setAlmoxarifadoId(null)
  }, [])

  const handleNavigateToEdit = (almoxarifadoId) => {
    setAlmoxarifadoId(almoxarifadoId)
    navigate(SGC_ROUTES.CADASTROS.CADASTRO_ALMOXARIFADO)
  }

  // const {
  //   data: results,
  //   mutateAsync,
  //   isPending,
  // } = useApiCadastrosSearchAlmox(() => {
  //   toast.error('Ocorreu um erro ao buscar os almoxarifados!')
  // })

  // const search = () => {
  //   mutateAsync({ descricao, tipo })
  // }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Cadastros', link: '/' },
          { label: 'Almoxarifado', link: SGC_ROUTES.CADASTROS.ALMOXARIFADO },
        ]}
      >
        <div>
          <div className="p-inputtext-sm my-6 flex">
            {/* <Input
                {...register('descricao')}
                type="text"
                className=" mr-2 w-1/5"
                label="Descrição"
              /> */}

            {/* <Select
                label="Tipo"
                className="mr-2 w-1/5"
                value={field.value}
                onChange={(e) => field.onChange(e)}
                options={[
                  { value: 1, label: 'Interno' },
                  { value: 2, label: 'Externo' },
                ]}
                optionLabel="label"
                optionValue="value"
              /> */}

            <IconButton
              // disabled={isPending}
              icon="pi pi-search sgc-blue-icons-primary"
              className="mt-6"
            />
          </div>
          <div>
            <div>
              <Button
                size="small"
                label="Novo"
                className="mb-4 flex  items-center justify-center gap-2 rounded-md border-none bg-sgc-green-primary p-2 py-1"
                onClick={() => {
                  navigate(SGC_ROUTES.CADASTROS.CADASTRO_ALMOXARIFADO)
                }}
              >
                <i className="pi pi-plus"></i>
              </Button>
            </div>
          </div>
          <Divider className="my-2" />

          <div>
            <Table
              // isLoading={isPending}
              // value={results?.data}
              paginator={true}
              allowExpansion
              // expandedRows={expandedRows}
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
                  body: (data) => {
                    return (
                      <Tag
                        label={data.tipo === 1 ? 'Interno' : 'Externo'}
                        color={
                          data.tipo === 1 ? COLORS_TAG.GREEN : COLORS_TAG.BLUE
                        }
                      />
                    )
                  },
                },
                {
                  field: '',
                  header: '',
                  body: (item) => {
                    return (
                      <div className={`flex h-6 justify-end gap-1 text-white`}>
                        <IconButton
                          containerHeight="h-6"
                          tooltip="Editar"
                          onClick={() => handleNavigateToEdit(item.id)}
                          iconComponent={<IoPencil size={18} />}
                          className="bg-sgc-blue-primary p-1"
                        />
                        <DeletePopup
                          feedbackMessage="Deseja realmente apagar o almoxarifado "
                          itemLabel={item.descricao}
                          // onAccept={() => deleteAlmoxarifado(item.id)}
                        />
                      </div>
                    )
                  },
                  className: '',
                },
              ]}
            ></Table>
          </div>
        </div>
      </Screen>
    </div>
  )
}
