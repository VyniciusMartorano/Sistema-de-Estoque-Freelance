
## URL's para produção



### Ferramentas para desenvolvimento

- Extensões VSCode:
  - [PostCSS](https://marketplace.visualstudio.com/items?itemName=csstools.postcss)
  - [TailwindCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Padronização de código com ESLint e Prettier

As configurações de eslint estão sendo importadados deste pacote: https://github.com/Rocketseat/eslint-config-rocketseat/blob/main/react.js

    - Largura máxima de texto: 80
    - Quantidade de espaços da tabulação: 2
    - Usar aspas simples
    - Usar parênteses em parâmetros de arrow functions. Ex.: (param) => {}
    - Não usar ponto e vírgula(;) no final das instruções

- Configurações do VS Code para formatação ao salvar:
  ```
  {
  ...
  editor.defaultFormatter rvest.vs-code-prettier-eslint,
  editor.formatOnPaste false,  required  formata ao colar
  editor.formatOnType false,  required  formata ao digitar
  editor.formatOnSave true,  optional  formatar ao salvar
  eslint.format.enable true,  ativa a formatação
  editor.codeActionsOnSave {
      source.fixAll explicit,
      source.fixAll.eslint explicit
  },
  ...
  }
  ```

Ps.: com o editor de texto configurado corretamente e os pacotes instalados, o prettier fará a correção dos erros ao salvar o arquivo. Não há necessidade de corrigir manualmente.

### Execução do projeto

Antes de instalar as dependências do projeto, renomeie o arquivo de exemplo das variavéis ambientes(.env.example) para ".env" e substitua as urls conforme necessidade(apontar para produção ou servidor local).

- Com a versão do node v21.7.3 instalada, para instalar as dependências do projeto, execute:

      npm install

- Para executar o projeto:

  - Modo de desenvolvimento:

        npm run dev

  - Modo de preview(espelho da produção):

    - Para gerar a build do preview:

      ```
      npm run build
      ```

    - Para executar:

      ```
      npm run preview
      ```

### Instruções para desenvolvimento

Dentro da pasta `src` estará todos os arquivos que compoem a parte visual do projeto.

- Para criar componentes, foi definido duas necessidades: componente que serão usados em todos os módulos(globais) ou componentes que são específicos de apenas um módulo(locais).

- A pasta `components` são os componentes globais, já para os componentes locais, cria uma pasta `components` em cada módulo. Ex.: `pages/_layouts/app/components`.

- A pasta `pages` contém todas as telas da aplicação. Divididas por dois módulos: auth e app. No diretório `auth`, serão todas as telas da camada de autenticação e cadastro dos usuários. No diretório `app`, serão todas as telas da aplicação, divididas por módulos. Ex.: `pages/app/qualidade`. No diretório `_layouts` foram criados os layouts padrão de cada módulo de páginas(auth e app).

- No diretório `routes`, são todas as rotas de navegação entre as telas bem como os componentes(screens) que serão renderizados em cada url. Diretórios para rotas públicas e privadas(que necessitam de autenticação). Telas para as rotas privadas são filhas do layout padrão `<AppLayout />`.

- O arquivo `navigation-routes.ts` contém o objeto com todas as urls de navegação para cada tela do app. Para telas novas, adicionar no objeto dos tipos e em seguida preencher no objeto das rotas com a url correspondente.

- No diretório `api`, temos os serviços de api de cada módulo: `coreApi(core.ts)`, `sajeApi(saje.ts)`... etc. Esses arquivos são responsáveis pelas configurações das apis de serviços específicos. Dentro deste diretório, contém a pasta `constants`, que contém os arquivos com as urls necessárias para realizar as requisições, sejam eles da camada de domínio ou externa.

- No diretório `services`, contém os serviços com funções de consultas de cada módulo. São métodos daquele que fazem requisições a api. Cada arquivo será referente ao módulo. Organizar de forma que todos os métodos estejam exclusivamente no serviço específico
