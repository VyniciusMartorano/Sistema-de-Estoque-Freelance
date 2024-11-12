import { Image } from 'primereact/image'
import { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ButtonSGC } from '@/components/buttons'
import { Input } from '@/components/input/input'
import { Screen } from '@/components/screen'
import { ProdutoContext } from '@/context/ProdutoContext'
import { useSGCNavigate } from '@/useNavigate'

import { SGC_ROUTES } from '../../../../routes/navigation-routes'
import Service from './service'

export function CadastroProduto() {
  const { navigate } = useSGCNavigate()
  const { produtoId } = useContext(ProdutoContext)
  const [produto, setProduto] = useState({
    id: null,
    nome: '',
    descricao: '',
    preco_compra: '',
    foto: null,
  })

  const service = new Service()
  const [inPromiseSave, setInPromiseSave] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!produtoId) return
    service.getProdutoById(produtoId).then(
      async ({ data }) => {
        if (data.foto) {
          const response = await fetch(data.foto)
          data.foto = await response.blob()
        }
        setProduto(data)
      },
      () => {
        toast.error('Ocorreu um erro ao buscar o produto selecionado!')
      }
    )
  }, [produtoId])

  const handleFieldChange = (e, field) => {
    const value = e.target ? e.target.value : e.value
    setProduto((prevProduto) => ({
      ...prevProduto,
      [field]: value,
    }))
  }

  const payloadIsValid = (payload) => {
    if (!payload.nome || !payload.preco_compra) {
      toast.warning('Preencha os campos obrigatórios e tente novamente!')
      return false
    }
    return true
  }

  const saveOrUpdate = () => {
    if (!payloadIsValid(produto)) return

    const formData = new FormData()
    if (produto.id) {
      formData.append('id', produto.id)
    }
    formData.append('nome', produto.nome)
    formData.append('descricao', produto.descricao)
    formData.append('preco_compra', produto.preco_compra)
    if (produto.foto && produto.foto instanceof Blob) {
      formData.append('foto', produto.foto, 'imagem.png')
    } else if (produto.foto) {
      formData.append('foto', produto.foto)
    }

    setInPromiseSave(true)
    service
      .saveOrUpdate(formData, produto.id)
      .then(
        async ({ data }) => {
          if (data.foto) {
            const response = await fetch(data.foto)
            data.foto = await response.blob()
          }
          setProduto(data)
          toast.success('O produto foi salvo com sucesso!')
          fileInputRef.value = ''
        },
        () => toast.error('Ocorreu um erro ao salvar o produto.')
      )
      .finally(() => {
        setInPromiseSave(false)
      })
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelected = (event) => {
    const file = event.target.files[0]
    if (file) {
      setProduto((prevProduto) => ({
        ...prevProduto,
        foto: file, // Armazena o arquivo selecionado diretamente
      }))
      toast.success('Imagem carregada com sucesso!')
    }
  }
  const renderImageSrc = () => {
    if (produto.foto && produto.foto instanceof Blob) {
      return URL.createObjectURL(produto.foto)
    } else if (
      typeof produto.foto === 'string' &&
      produto.foto.startsWith('http')
    ) {
      return produto.foto
    }
    return null
  }
  const icon = <i className="pi pi-eye"></i>
  return (
    <div>
      <Screen
        itens={[
          { label: 'Produtos', link: SGC_ROUTES.CADASTROS.PRODUTO },
          {
            label: 'Cadastro',
            link: SGC_ROUTES.CADASTROS.CADASTRO_PRODUTO,
          },
        ]}
      >
        <div>
          <div className="mr-1 w-full p-3 md:w-3/6 lg:w-1/4 xl:w-1/5">
            {produto.foto && (
              <div className="mt-4 max-h-[100px] max-w-[100px]">
                <Image
                  src={renderImageSrc()}
                  indicatorIcon={icon}
                  preview
                  alt="Imagem do Produto"
                />
              </div>
            )}
          </div>
          <div className="p-inputtext-sm my-6  flex flex-grow-0 flex-wrap">
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
              <Input
                value={produto.nome}
                onChange={(e) => handleFieldChange(e, 'nome')}
                type="text"
                className="w-full"
                label="Nome"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
              <Input
                value={produto.descricao}
                onChange={(e) => handleFieldChange(e, 'descricao')}
                type="text"
                className="w-full"
                label="Descrição"
              />
            </div>
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
              <Input
                value={produto.preco_compra}
                onChange={(e) => handleFieldChange(e, 'preco_compra')}
                type="number"
                className="w-full"
                label="Preço de Compra"
                step="0.01"
              />
            </div>
            <div className="p-inputtext-sm my-6 flex flex-grow-0 ">
              <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
                <div className="mr-1w-full md:w-3/6 lg:w-1/4 xl:w-1/5">
                  <ButtonSGC
                    className=" p-button-info h-7"
                    icon="pi pi-upload"
                    label="Selecionar Imagem"
                    onClick={handleFileUpload}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelected}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex w-full flex-row flex-wrap justify-start gap-2">
            <div className="mr-1 w-full md:w-3/6 lg:w-1/4 xl:w-1/5 ">
              <ButtonSGC
                label="Voltar"
                bgColor="sgc-blue-primary"
                icon="pi pi-arrow-left"
                type="button"
                className="h-8 w-full"
                onClick={() => navigate(SGC_ROUTES.CADASTROS.PRODUTO)}
              />
            </div>
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
          </div>
        </div>
      </Screen>
    </div>
  )
}
