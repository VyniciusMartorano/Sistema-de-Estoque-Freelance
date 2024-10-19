import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ButtonSGC } from '@/components/buttons'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { SpanError } from '@/components/span-error'
import { GrupoItemContext } from '@/context/GrupoItemContext'
import {
  useApiGetGrupoItemById,
  useApiGetOptionsGrupoSintetico,
  useSaveOrUpdate,
} from '@/hooks/querys/cadastro/useApiCadastrosGrupo'
import { useSGCNavigate } from '@/hooks/useNavigate'
import { SGC_ROUTES } from '@/routes/navigation-routes'

const almoxForm = z.object({
  id: z.number().optional().nullable(),
  descricao: z.string().optional(),
  tipo: z.number().optional(),
  analitico: z.number().optional(),
  grupoitem_id: z.number().optional().nullable(),
})

export interface IntItemDropdown {
  value: number
  label: string
}

export type GrupoItemType = z.infer<typeof almoxForm>

export function CadastroGrupoItem() {
  const { grupoItemId } = useContext(GrupoItemContext)
  const { navigate } = useSGCNavigate()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [optionsGrupoSintetico, setOptionsGrupoSintetico] = useState<
    IntItemDropdown[]
  >([])
  const msgFieldNotFilled = 'Não preenchido!'

  const { mutateAsync: getOptionsGruposSintetico } =
    useApiGetOptionsGrupoSintetico()

  const { mutateAsync: getGrupoItemById, isPending } = useApiGetGrupoItemById()

  const { mutateAsync: apiSaveOrUpdate, isPending: inPromiseSave } =
    useSaveOrUpdate()

  const { handleSubmit, control, reset, getValues } = useForm<GrupoItemType>({
    resolver: zodResolver(almoxForm),
    defaultValues: {
      id: undefined,
      descricao: '',
      tipo: undefined,
    },
  })

  useEffect(() => {
    if (grupoItemId) {
      getGrupoItemById(grupoItemId).then(
        ({ data }) => {
          reset(data)
          getOptionsSinteticos()
        },
        () => toast.error('Ocorreu um erro ao buscar o grupo!')
      )
    } else {
      getOptionsSinteticos()
    }
  }, [])

  const getOptionsSinteticos = () => {
    getOptionsGruposSintetico().then(
      ({ data }) =>
        setOptionsGrupoSintetico(
          data.filter((i) => i.value !== getValues().id)
        ),
      () => toast.error('Ocorreu um erro ao buscar os grupos sinteticos!')
    )
  }

  const payloadIsValid = (payload: GrupoItemType): boolean => {
    if (!payload.descricao || payload.descricao.length < 1) return false

    return true
  }

  const saveOrUpdate = () => {
    setIsSubmitted(true)
    const payload = getValues()
    if (!payloadIsValid(payload)) {
      toast.warning('Preencha todos os campos e tente novamente!')
      return
    }

    apiSaveOrUpdate({
      ...payload,
      analitico: payload.grupoitem_id ? 1 : 0,
    }).then(
      ({ data }) => {
        reset(data)
        toast.success('Os dados foram salvos com suecesso!')
      },
      ({ response }) => toast.error(response.data.error)
    )
  }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Cadastros', link: '/' },
          { label: 'Grupo Item', link: SGC_ROUTES.CADASTROS.GRUPO_ITEM },
          {
            label: 'Cadastro',
            link: SGC_ROUTES.CADASTROS.GRUPO_ITEM_CADASTRO,
          },
        ]}
      >
        <div>
          <form onSubmit={handleSubmit(saveOrUpdate)}>
            <div className="p-inputtext-sm my-6 flex">
              <Controller
                name="descricao"
                control={control}
                render={({ field }) => (
                  <div className="flex w-2/4 flex-col">
                    <Input
                      type="text"
                      {...field}
                      maxLength={50}
                      className="mr-1 w-1/5"
                      label="Descrição"
                    />
                    {isSubmitted &&
                      (!field.value || field.value.length < 1) && (
                        <SpanError error={msgFieldNotFilled} />
                      )}
                  </div>
                )}
              />
              <Controller
                name="grupoitem_id"
                control={control}
                render={({ field }) => (
                  <div className="flex w-1/4 flex-col">
                    <Select
                      label="Filho de"
                      className=""
                      {...field}
                      filter
                      options={optionsGrupoSintetico}
                      optionLabel="label"
                      optionValue="value"
                    />
                  </div>
                )}
              />
            </div>
            <div className="mt-20 flex w-full flex-row justify-start gap-2">
              <ButtonSGC
                label="Cancelar"
                bgColor="simas-red-primary"
                type="button"
                onClick={() => navigate(SGC_ROUTES.CADASTROS.GRUPO_ITEM)}
              />
              <ButtonSGC
                disabled={isPending || inPromiseSave}
                label="Salvar"
                bgColor="simas-green-primary"
                type="submit"
              />
            </div>
          </form>
        </div>
      </Screen>
    </div>
  )
}
