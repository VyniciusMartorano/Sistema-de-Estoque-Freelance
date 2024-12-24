import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ButtonSGC } from '@/components/buttons'
import { DeletePopup } from '@/components/dialogs/delete-popup'
import { Select } from '@/components/input'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { Table } from '@/components/table'
import { EstoqueContext } from '@/context/EstoqueContext'
import { useSGCNavigate } from '@/useNavigate'

import { InputCalendar } from '../../../../components/input/calendar'
import { InputNum } from '../../../../components/input/input-number'
import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import { Formaters } from '../../../../utils/formaters'
import isEmpty from '../../../../utils/isEmpty'
import Service from './service'

export function CadastroCI() {
  const { navigate } = useSGCNavigate()
  const { ciId } = useContext(EstoqueContext)
  const [itens, setItens] = useState([])
  const [produtos, setProdutos] = useState([])
  const [users, setUsers] = useState([])
  const formatador = new Formaters()
  const [item, setItem] = useState({
    produto: null,
    quantidade: 0,
    preco_unitario: 0,
    saldo_disponivel: 0,
  })
  const [CI, setCI] = useState({
    id: null,
    data: new Date(),
    observacao: '',
    user: null,
    tipo: 1,
  })

  const tipoEnum = {
    ENTRADA: 1,
    SAIDA: 2,
  }

  const [inPromise, setInPromise] = useState(false)
  const [inPromiseSearchProduto, setinPromiseSearchProduto] = useState(false)
  const [inPromiseSearchUsers, setinPromiseSearchUsers] = useState(false)

  const service = new Service()
  const [inPromiseSave, setInPromiseSave] = useState(false)

  useEffect(() => {
    if (!ciId) return

    setInPromise(true)
    service
      .getCiById(ciId)
      .then(
        async ({ data }) => {
          data.data = new Date(data.data + ' 00:00:00')
          setCI(data)
          getItensByCI(data.id)
        },
        () => {
          toast.error('Ocorreu um erro ao buscar o CI selecionado!')
        }
      )
      .finally(() => setInPromise(false))
  }, [])

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
    setinPromiseSearchUsers(true)
    service
      .getUsers()
      .then(
        ({ data }) => setUsers(data),
        () => {
          toast.error('Ocorreu um erro ao buscar os usuarios disponiveis!')
        }
      )
      .finally(() => setinPromiseSearchUsers(false))
  }

  const getProdutos = (userId) => {
    setinPromiseSearchProduto(true)
    service
      .getProdutosComSaldo(userId)
      .then(
        ({ data }) => setProdutos(data),
        () => {
          toast.error('Ocorreu um erro ao buscar os produtos disponiveis!')
        }
      )
      .finally(() => setinPromiseSearchProduto(false))
  }

  const getItensByCI = (ciId) => {
    service.getItensByCI(ciId).then(
      async ({ data }) => {
        setItens(data)
      },
      () => {
        toast.error('Ocorreu um erro ao buscar os itens da CI selecionada!')
      }
    )
  }

  const handleFieldChange = (e, field) => {
    if (field === 'tipo') {
      setItem({
        produto: null,
        quantidade: 0,
        preco_unitario: 0,
        saldo_disponivel: 0,
      })
    }
    const value = e.target ? e.target.value : e.value
    setCI((prevProduto) => ({
      ...prevProduto,
      [field]: value,
    }))

    if (field === 'user') {
      getProdutos(value)
      setItem({
        produto: null,
        quantidade: 0,
        preco_unitario: 0,
        saldo_disponivel: 0,
      })
    }
  }

  const handleFieldItemChange = (e, field) => {
    const value = e.target ? e.target.value : e.value
    let produto = null

    if (field === 'produto') {
      produto = produtos.find((i) => i.id === value)
    }

    setItem((prevProduto) => ({
      ...prevProduto,
      [field]: value,
      saldo_disponivel: produto
        ? produto.saldo_disponivel
        : prevProduto.saldo_disponivel,
    }))
  }

  const payloadIsValid = (payload) => {
    if (!payload.tipo || !payload.observacao || !payload.user) {
      toast.warning('Preencha os campos obrigatórios e tente novamente!')
      return false
    }
    return true
  }
  const saveOrUpdateItens = (ciId) => {
    const refatoredItens = itens.map((i) => {
      return { ...i, ci: ciId }
    })
    service
      .saveItens(refatoredItens)
      .then(
        async ({ data }) => {
          setItens(data)
          toast.success('A CI foi salva com sucesso!')
          navigate(SGC_ROUTES.ESTOQUE.CI)
        },
        () => toast.error('Ocorreu um erro ao salvar a CI.')
      )
      .finally(() => {
        setInPromiseSave(false)
      })
  }

  const saveOrUpdate = () => {
    if (!payloadIsValid(CI)) return

    setInPromiseSave(true)
    const payload = {
      ...CI,
      data: formatador.formatDate(CI.data, 'YYYY-MM-DD'),
    }
    service.saveOrUpdate(payload).then(
      async (resp) => {
        setCI({ ...resp.data, data: new Date(resp.data.data + ' 00:00:00') })
        saveOrUpdateItens(resp.data.id)
      },
      () => {
        toast.error('Ocorreu um erro ao salvar a CI.')
        setInPromiseSave(false)
      }
    )
  }
  const removeItem = (produtoId) => {
    setItens(itens.filter((i) => i.produto !== produtoId))
  }

  const addItem = () => {
    const exceptions = CI.tipo === tipoEnum.SAIDA ? ['preco_unitario'] : []
    if (isEmpty(item, exceptions)) {
      toast.warning('Preencha os campos corretamente para adicionar o item.')
      return
    }
    const produtoInList = itens.filter((i) => i.produto === item.produto)
    if (produtoInList.length > 0) {
      toast.warning(
        'O produto ja foi registrado na CI, remova da listagem e lance novamente!'
      )
      return
    }
    if (item.quantidade < 0.01) {
      toast.warning('A quantidade deve ser superior a 0!')
      return
    }
    if (!CI.user) {
      toast.warning('Você deve selecionar o usuario antes de adicionar!')
      return
    }

    const produto = produtos.find((i) => i.id === item.produto)
    setItens([
      ...itens,
      {
        ...item,
        produto_label: produto.label,
        preco_unitario:
          CI.tipo === tipoEnum.ENTRADA
            ? item.preco_unitario
            : produto.preco_compra,
      },
    ])
    setItem({
      produto: null,
      quantidade: 0,
      preco_unitario: 0,
      saldo_disponivel: 0,
    })
    getProdutos(CI.user)
  }

  const headerTable = ciId ? (
    <div></div>
  ) : (
    <div className="grid">
      <Select
        disabled={!CI.user}
        label="Produto"
        className="mr-2 w-full"
        value={item.produto}
        onChange={(e) => handleFieldItemChange(e, 'produto')}
        options={produtos}
        optionLabel="label"
        optionValue="id"
        loading={inPromiseSearchProduto}
        filter
      />
      <InputNum
        disabled={!item.produto}
        value={item.quantidade}
        onChange={(e) => handleFieldItemChange(e, 'quantidade')}
        className="w-full"
        maxFractionDigits={2}
        label="Quantidade"
        locale="en-US"
        min={0.0}
        max={CI.tipo === tipoEnum.ENTRADA ? null : item.saldo_disponivel}
      />
      {CI.tipo === tipoEnum.SAIDA && (
        <InputNum
          disabled
          value={item.saldo_disponivel}
          className="w-full"
          maxFractionDigits={2}
          label="Saldo disponível"
          locale="en-US"
        />
      )}
      {CI.tipo === tipoEnum.ENTRADA && (
        <InputNum
          disabled={!item.produto}
          value={item.preco_unitario}
          onChange={(e) => handleFieldItemChange(e, 'preco_unitario')}
          className="w-full"
          maxFractionDigits={2}
          minFractionDigits={2}
          locale="en-US"
          label="Preço Unitário"
          min={0}
        />
      )}

      <div className="mb-2 mr-1 mt-2 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
        <ButtonSGC
          disabled={inPromiseSave}
          label="Adicionar"
          icon="pi pi-plus"
          className="h-8 w-full"
          onClick={addItem}
          bgColor="sgc-green-primary"
          type="submit"
        />
      </div>
    </div>
  )

  return (
    <div>
      <Screen
        itens={[
          { label: 'CI', link: SGC_ROUTES.ESTOQUE.CI },
          {
            label: 'Cadastro',
            link: SGC_ROUTES.ESTOQUE.CADASTRO_CI,
          },
        ]}
      >
        <div>
          <div className="p-inputtext-sm my-6  flex flex-grow-0 flex-wrap">
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
              <InputCalendar
                disabled={true}
                value={CI.data}
                className="w-full"
                label="Data"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
              <Select
                disabled={itens.length > 0 || ciId}
                label="Tipo"
                className="mr-2 w-full"
                value={CI.tipo}
                onChange={(e) => handleFieldChange(e, 'tipo')}
                options={[
                  { label: 'Entrada', value: 1 },
                  { label: 'Saída', value: 2 },
                ]}
                optionLabel="label"
                optionValue="value"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
              <Select
                disabled={itens.length > 0 || ciId}
                label="Usuario"
                className="mr-2 w-full"
                value={CI.user}
                loading={inPromiseSearchUsers}
                onChange={(e) => handleFieldChange(e, 'user')}
                options={users}
                optionLabel="label"
                optionValue="id"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
              <Input
                disabled={ciId}
                value={CI.observacao}
                onChange={(e) => handleFieldChange(e, 'observacao')}
                type="text"
                className="w-full"
                label="Observação"
              />
            </div>
          </div>
          <h2>Itens</h2>
          {CI.tipo === tipoEnum.ENTRADA ? (
            <Table
              paginator={true}
              header={headerTable}
              value={itens}
              isLoading={inPromise}
              columns={[
                {
                  field: 'produto_label',
                  header: 'Produto',
                  className: '8/12 p-1',
                },
                {
                  field: 'quantidade',
                  header: 'Quantidade',
                  className: 'w-2/12 p-1 text-right',
                },
                {
                  field: 'preco_unitario',
                  header: 'P. Unit',
                  className: 'w-2/12 p-1 text-right',
                  body: (item) => (
                    <div>{parseFloat(item.preco_unitario).toFixed(2)}</div>
                  ),
                },
                {
                  field: '',
                  header: '',
                  body: (item) =>
                    ciId ? (
                      <div></div>
                    ) : (
                      <div className="flex h-6 justify-end gap-1 text-white">
                        <DeletePopup
                          feedbackMessage="Deseja realmente apagar o item?"
                          itemLabel={''}
                          onAccept={() => removeItem(item.produto)}
                        />
                      </div>
                    ),
                  className: '',
                },
              ]}
            ></Table>
          ) : (
            <Table
              paginator={true}
              header={headerTable}
              value={itens}
              isLoading={inPromise}
              columns={[
                {
                  field: 'produto_label',
                  header: 'Produto',
                  className: '4/12 p-1',
                },
                {
                  field: 'quantidade',
                  header: 'Quantidade',
                  className: 'w-4/12 p-1',
                },
                {
                  field: '',
                  header: '',
                  body: (item) =>
                    ciId ? (
                      <div></div>
                    ) : (
                      <div className="flex h-6 justify-end gap-1 text-white">
                        <DeletePopup
                          feedbackMessage="Deseja realmente apagar o item?"
                          itemLabel={''}
                          onAccept={() => removeItem(item.produto)}
                        />
                      </div>
                    ),
                  className: '',
                },
              ]}
            ></Table>
          )}

          <div className="mt-5 flex w-full flex-row flex-wrap justify-start gap-2">
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <ButtonSGC
                label="Voltar"
                bgColor="sgc-blue-primary"
                icon="pi pi-arrow-left"
                type="button"
                className="h-8 w-full"
                onClick={() => navigate(SGC_ROUTES.ESTOQUE.CI)}
              />
            </div>
            {!ciId && (
              <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
                <ButtonSGC
                  disabled={inPromiseSave}
                  label="Salvar"
                  icon="pi pi-check"
                  className="h-8 w-full"
                  onClick={saveOrUpdate}
                  bgColor="sgc-green-primary"
                  type="submit"
                />
              </div>
            )}
          </div>
        </div>
      </Screen>
    </div>
  )
}
