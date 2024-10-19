import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosResponse } from 'axios'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoPencil } from 'react-icons/io5'
import { toast } from 'sonner'
import { z } from 'zod'

import { IconButton } from '@/components/buttons'
import { DeletePopup } from '@/components/dialogs/delete-popup'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { GrupoItemContext } from '@/context/GrupoItemContext'
import {
  useApiCadastrosGetFilhosGrupoItem,
  useApiCadastrosSearchGrupoItem,
  useDeleteGrupoItem,
} from '@/hooks/querys/cadastro/useApiCadastrosGrupo'
import { useSGCNavigate } from '@/hooks/useNavigate'
import { SGC_ROUTES } from '@/routes/navigation-routes'

const almoxFiltersForm = z.object({
  descricao: z.string().optional(),
})

export interface intGrupoItemDT {
  id: number
  descricao: string
  items: intGrupoItemDT[]
}

export type GrupoItemFiltersType = z.infer<typeof almoxFiltersForm>

export function ConsultaGrupoItem() {
  const { handleSubmit, watch, register } = useForm<GrupoItemFiltersType>({
    resolver: zodResolver(almoxFiltersForm),
  })
  const { setGrupoItemId } = useContext(GrupoItemContext)
  const { navigate } = useSGCNavigate()

  useEffect(() => {
    setGrupoItemId(null)
  }, [])

  const handleNavigateToEdit = (grupoItemId: number | null) => {
    setGrupoItemId(grupoItemId)
    navigate(SGC_ROUTES.CADASTROS.GRUPO_ITEM_CADASTRO)
  }

  const { mutateAsync: apiDeleteGrupoItem } = useDeleteGrupoItem()

  const {
    data: results,
    mutateAsync,
    isPending,
  } = useApiCadastrosSearchGrupoItem()

  const { mutateAsync: apiGetFilhosGrupoItem } =
    useApiCadastrosGetFilhosGrupoItem()

  const search = () => {
    const descricao = watch('descricao')

    mutateAsync({ descricao }).catch(() =>
      toast.warning('Ocorreu um erro ao buscar os grupos!')
    )
  }

  const deleteGrupoItem = (grupoItemId: number) => {
    apiDeleteGrupoItem(grupoItemId).then(
      () => {
        toast.success('Operação realizada com sucesso!')
        if (results) {
          results.data = results?.data.filter((i: intGrupoItemDT) => {
            i.items = i.items.filter(
              (a: intGrupoItemDT) => a.id !== grupoItemId
            )
            return i.id !== grupoItemId
          })
        }
      },
      (error) => toast.error(error)
    )
  }

  const [expandedRows, setExpandedRows] = useState<intGrupoItemDT[]>([])

  const rowExpansionTemplate = (data: intGrupoItemDT) => {
    return (
      <Table
        value={data.items}
        className="ml-4"
        columns={[
          { className: 'w-[28px]', style: { padding: 0 } },
          {
            field: 'descricao',
            header: 'Descrição',
            className: '1/12 p-1',
          },
          {
            field: '',
            header: '',
            body: (item: intGrupoItemDT) => {
              return (
                <div className={`flex h-6 justify-end gap-1 text-white`}>
                  <IconButton
                    containerHeight="h-6"
                    tooltip="Editar"
                    onClick={() => handleNavigateToEdit(item.id)}
                    iconComponent={<IoPencil size={18} />}
                    className="bg-simas-blue-primary p-1"
                  />
                  <DeletePopup
                    feedbackMessage="Deseja realmente apagar o grupo "
                    itemLabel={item.descricao}
                    onAccept={() => deleteGrupoItem(item.id)}
                  />
                </div>
              )
            },
            className: '',
          },
        ]}
      ></Table>
    )
  }

  const onRowExpand = (event: { data: intGrupoItemDT }) => {
    apiGetFilhosGrupoItem(event.data.id).then(
      (response: AxiosResponse<intGrupoItemDT[]>) => {
        event.data.items = response.data
      },
      () => toast.error('Ocorreu um erro ao buscar os itens.')
    )
  }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Cadastros', link: '/' },
          { label: 'Grupo Item', link: SGC_ROUTES.CADASTROS.GRUPO_ITEM },
        ]}
      >
        <div>
          <form onSubmit={handleSubmit(search)}>
            <div className="p-inputtext-sm my-6 flex">
              <Input
                {...register('descricao')}
                type="text"
                className=" mr-2 w-1/5"
                label="Descrição"
              />

              <IconButton
                disabled={isPending}
                icon="pi pi-search simas-blue-icons-primary"
                className="mt-6"
              />
            </div>
          </form>
          <div>
            <form>
              <div>
                <Button
                  size="small"
                  label="Novo"
                  className="mb-4 flex  items-center justify-center gap-2 rounded-md border-none bg-simas-green-primary p-2 py-1"
                  onClick={() => {
                    navigate(SGC_ROUTES.CADASTROS.GRUPO_ITEM_CADASTRO)
                  }}
                >
                  <i className="pi pi-plus"></i>
                </Button>
              </div>
            </form>
          </div>
          <Divider className="my-2" />

          <div>
            <Table
              isLoading={isPending}
              value={results?.data}
              dataKey="id"
              paginator={true}
              allowExpansion={true}
              // @ts-ignore
              onRowExpand={onRowExpand}
              expandedRows={expandedRows}
              rowExpansionTemplate={rowExpansionTemplate}
              // @ts-ignore
              onRowToggle={(e) => setExpandedRows(e.data)}
              columns={[
                {
                  field: 'descricao',
                  header: 'Descrição',
                  className: '1/12 p-1',
                },
                {
                  field: '',
                  header: '',
                  body: (item: intGrupoItemDT) => {
                    return (
                      <div className={`flex h-6 justify-end gap-1 text-white`}>
                        <IconButton
                          containerHeight="h-6"
                          tooltip="Editar"
                          onClick={() => handleNavigateToEdit(item.id)}
                          iconComponent={<IoPencil size={18} />}
                          className="bg-simas-blue-primary p-1"
                        />
                        <DeletePopup
                          feedbackMessage="Deseja realmente apagar o grupo "
                          itemLabel={item.descricao}
                          onAccept={() => deleteGrupoItem(item.id)}
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
