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
import { AlmoxarifadoContext } from '@/context/AlmoxarifadoContext'
import {
  useApiGetAlmoxById,
  useSaveOrUpdate,
} from '@/hooks/querys/cadastro/useApiCadastrosAlmox'
import { useSGCNavigate } from '@/hooks/useNavigate'
import { SGC_ROUTES } from '@/routes/navigation-routes'

const almoxForm = z.object({
  id: z.number().optional().nullable(),
  descricao: z.string().optional(),
  tipo: z.number().optional(),
})


export function CadastroAlmoxarifado() {
  const { almoxarifadoId } = useContext(AlmoxarifadoContext)
  const { navigate } = useSGCNavigate()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const msgFieldNotFilled = 'Não preenchido!'

  const { mutateAsync: getAlmoxById, isPending } = useApiGetAlmoxById()

  const { mutateAsync: apiSaveOrUpdate, isPending: inPromiseSave } =
    useSaveOrUpdate(
      () => toast.success('Os dados foram salvos com suecesso!'),
      () => toast.error('Ocorreu um erro ao salvar os dados!')
    )

  const { handleSubmit, control, reset, getValues } = useForm<AlmoxType>({
    resolver: zodResolver(almoxForm),
    defaultValues: { id: undefined, descricao: '', tipo: undefined },
  })

  useEffect(() => {
    if (!almoxarifadoId) return

    getAlmoxById(almoxarifadoId).then(
      ({ data }) => reset(data),
      () => {
        toast.error('Ocorreu um erro ao buscar o almoxarifado!')
      }
    )
  }, [])

  const payloadIsValid = (payload) => {
    if (!payload.descricao || payload.descricao.length < 1) return false
    if (!payload.tipo) return false

    return true
  }

  const saveOrUpdate = () => {
    setIsSubmitted(true)
    const payload = getValues()
    if (!payloadIsValid(payload)) {
      toast.warning('Preencha todos os campos e tente novamente!')
      return
    }

    apiSaveOrUpdate(payload).then(({ data }) => reset(data))
  }

  return (
    <div>
      <Screen
        itens={[
          { label: 'Cadastros', link: '/' },
          { label: 'Almoxarifado', link: SGC_ROUTES.CADASTROS.ALMOXARIFADO },
          {
            label: 'Cadastro',
            link: SGC_ROUTES.CADASTROS.CADASTRO_ALMOXARIFADO,
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
                  <div className="flex w-3/4 flex-col">
                    <Input
                      type="text"
                      {...field}
                      maxLength={50}
                      className="mr-2 w-1/5"
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
                name="tipo"
                control={control}
                render={({ field }) => (
                  <div className="flex w-1/4 flex-col">
                    <Select
                      label="Tipo"
                      className=""
                      {...field}
                      options={[
                        { value: 1, label: 'Interno' },
                        { value: 2, label: 'Externo' },
                      ]}
                      optionLabel="label"
                      optionValue="value"
                    />
                    {isSubmitted && !field.value && (
                      <SpanError error={msgFieldNotFilled} />
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mt-20 flex w-full flex-row justify-start gap-2">
              <ButtonSGC
                label="Cancelar"
                bgColor="simas-red-primary"
                type="button"
                onClick={() => navigate(SGC_ROUTES.CADASTROS.ALMOXARIFADO)}
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
