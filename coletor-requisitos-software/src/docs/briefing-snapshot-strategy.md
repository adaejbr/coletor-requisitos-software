# Estratégia de snapshot e versão para briefing

## Objetivo

Garantir que uma resposta mantenha a estrutura do formulário que foi usada no momento do preenchimento, mesmo quando o formulário for editado depois.

## Regra aplicada no MVP

- Todo `RespostaBriefing` deve guardar `snapshotFormulario` com a cópia do `FormularioBriefing` válido no instante da primeira resposta.
- A resposta também guarda `versaoFormulario` para registrar a versão do formulário usada.
- Quando uma resposta ainda estiver em rascunho, o snapshot pode ser atualizado apenas se a resposta não foi concluída.
- Quando a resposta estiver concluída, o snapshot não deve ser alterado.

## Padrão recomendado

1. Ao criar a primeira resposta para um formulário, guardar uma cópia completa do formulário em `snapshotFormulario`.
2. Persistir `versaoFormulario` igual ao `formulario.versao` atual.
3. Na renderização de respostas antigas, priorizar `snapshotFormulario` e descartar seções/perguntas inativas que não existiam na estrutura original.
4. Em futuras versões, o formulário pode ser reeditado, mas o histórico das respostas permanece estável.

## Implementação sugerida

- `briefingResponseRepository` deve salvar `snapshotFormulario` junto com `respostas`.
- `useBriefingResponses` deve manter o estado do formulário montado a partir do snapshot quando necessário.
- O fluxo de preenchimento pode comparar `snapshotFormulario` com `formularioAtual` para exibir avisos de mudança sem quebrar respostas antigas.
