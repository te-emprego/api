# Como Contribuir

O Te Emprego adotou o modelo de negócios Open Source, onde a comunidade irá participar e guiar seu desenvolvimento.

## Código de conduta
Estamos terminando de escrever um código de conduta que adotaremos, e esperamos que todos os colaboradores também o adotem. Assim que concluído, vamos liberar o acesso.

Por hora, apenas seja:
  - Amigável
  - Receptivo
  - Respeitoso
  - Compreensivo


## Colaboradores
Todo trabalho no Te Emprego acontece diretamente no GitHub. Tanto membros do Core Team quanto contribuidores externos devem enviar pull requests que vão passar pelo mesmo processo de revisão.

## Organização de Branches
Nós buscaremos fazer o nosso melhor para manter branch `master` organizada, com testes passando todas as vezes. É importante entender que tudo que estiver no master será a release estável mais atual do projeto.

O branch `develop` conterá todas as novidades para a próxima release. Vale ressaltar que nem tudo que está no branch develop é definitivo, então, usaremos ele somente como base para adicionar novas features, e não correção de bugs.

Ao enviar um **pull request**, certifique-se de que o mesmo não altera o branch master, pois será automaticamente recusado.

Então, resumidamente, para:

  - Corrigir bugs: branch a partir do `master`
  - Adicionar features: branch a partir do `develop`

## Semântica dos branchs
Para facilitar o entendimento (e, posteriormente, automatizar tarefas) utilizamos dois prefixos para nomes de branchs:

  - `hotfix/short-description`
  - `feature/short-description`

  - `hotfix`

Use o prefixo `hotfix/` para modificações de correção de bugs, refatoração de código ou algo relacionado a um *fix*.

  - `feature`

Use o prefixo `feature/` para modificações de implementação de novos recursos ou algo relacionado a adição de algo.

## Semântica dos commits
Recomendamos fortemente aos contribuidores a utilização de uma ferramenta que gera mensagens de commit. Uma ótima ferramenta (utilizada pelo *core team*, inclusive) é o commitizen.

Ele gera commits semânticos com `${tipo}(${arquivo}): ${ação}`. Exemplos de commits gerados pelo comittizen:

  - `refactor(ModuleRegister): add controller typedef on function param`
  - `feat(authentication): google oauth 2.0 passport authentication`
  - `docs(license): move license file to markdown rules`

## Enviando um *pull request*
O Core Team está monitorando os pull requests. Analisaremos seu envio e fazermos o merge, solicitaremos alterações ou podemos fechá-la com uma explicação plausível. Para alterações de API, podemos precisar corrigir nossos usos internos no site, o que pode causar algum atraso. Faremos o nosso melhor para fornecer atualizações e feedback durante todo o processo.

O Daniel Bonifacio criou um [vídeo onde mostra passo a passo como contribuir para os nossos repositórios](https://youtu.be/n0lSrPl9DTc).

O Te Emprego utiliza a ferramenta de análise de código **Codacy**, que analisa todo o código do pull request. Você deverá ver uma mensagem de sucesso ou fracasso após essa análise.

## Licença de Acordo de Contribuidor (CLA)
Para aceitar seu pull request, precisamos que você envie um CLA. Você só precisa fazer isso uma vez, então se você fez isso para outro projeto de código aberto do Te Emprego, você está pronto para continuar. Se você estiver enviando um pull request pela primeira vez, nos informe que você concluiu o CLA e então podemos fazer uma verificação cruzada com seu GitHub.

O link para aplicação da CLA estará disponível em breve.

## Pré-requisitos de Contribuição
Cada repositório possui pré-requisitos de contribuição diferentes.

Você pode encontrar eles no arquivo **`README.md`** de cada repositório.

## Guia de estilo
Cada projeto possui um guia-de-estilo padrão.

Você pode encontrar eles no arquivo **`README.md`** de cada repositório.

## Licença
Ao contribuir com o Te Emprego, você concorda que suas contribuições serão licenciadas sob sua licença padrão do GNU GPLv3, ou sob a licença atual do reposiótio.

Você pode encontrar detalhes da licença no arquivo **`LICENSE.md`** de cada repositório.
