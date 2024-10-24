// import { useContext, useEffect, useState } from 'react'
// import { toast } from 'sonner'

import { ButtonSGC } from '@/components/buttons'
// import { Select } from '@/components/input'
// import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { SGC_ROUTES } from '@/routes/navigation-routes'
// import { SpanError } from '@/components/span-error'
// import { AlmoxarifadoContext } from '@/context/AlmoxarifadoContext'
import { useSGCNavigate } from '@/useNavigate'

export function CadastroAlmoxarifado() {
  // const { almoxarifadoId } = useContext(AlmoxarifadoContext)
  // const msgFieldNotFilled = 'Não preenchido!'
  // const [isSubmitted, setIsSubmitted] = useState(false)
  const { navigate } = useSGCNavigate()

  // useEffect(() => {
  //   if (!almoxarifadoId) return

  //   getAlmoxById(almoxarifadoId).then(
  //     ({ data }) => reset(data),
  //     () => {
  //       toast.error('Ocorreu um erro ao buscar o almoxarifado!')
  //     }
  //   )
  // }, [])

  // const payloadIsValid = (payload) => {
  //   if (!payload.descricao || payload.descricao.length < 1) return false
  //   if (!payload.tipo) return false

  //   return true
  // }

  // const saveOrUpdate = () => {
  //   setIsSubmitted(true)
  //   const payload = getValues()
  //   if (!payloadIsValid(payload)) {
  //     toast.warning('Preencha todos os campos e tente novamente!')
  //   }

  //   // apiSaveOrUpdate(payload).then(({ data }) => reset(data))
  // }

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
          <div className="p-inputtext-sm my-6 flex">
            {/* <Controller
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
                  {isSubmitted && (!field.value || field.value.length < 1) && (
                    <SpanError error={msgFieldNotFilled} />
                  )}
                </div>
              )}
            /> */}

            <div className="flex w-1/4 flex-col">
              {/* <Select
                label="Tipo"
                className=""
                {...field}
                options={[
                  { value: 1, label: 'Interno' },
                  { value: 2, label: 'Externo' },
                ]}
                optionLabel="label"
                optionValue="value"
              /> */}
              {/* {isSubmitted && !field.value && (
                <SpanError error={msgFieldNotFilled} />
              )} */}
            </div>
          </div>
          <div className="mt-20 flex w-full flex-row justify-start gap-2">
            <ButtonSGC
              label="Cancelar"
              bgColor="simas-red-primary"
              type="button"
              onClick={() => navigate('/')}
            />
            <ButtonSGC
              // disabled={isPending || inPromiseSave}
              label="Salvar"
              bgColor="simas-green-primary"
              type="submit"
            />
          </div>
        </div>
      </Screen>
    </div>
  )
}
