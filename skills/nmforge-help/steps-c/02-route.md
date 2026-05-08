# Step 02 — Escolher modo de resposta

## Sinal do usuário → modo

| Pergunta | Modo |
|----------|------|
| "que skills tem?" / "lista" / "o que existe?" | **lista** |
| "como faço X?" / "preciso de Y" / "qual skill para Z?" | **match** |
| "e agora?" / "próximo passo" / "o que faço?" | **próximo** |

## Quando ambíguo

Use `AskUserQuestion` com 3 opções:

- Listar todas as skills disponíveis
- Buscar por palavra-chave
- Sugerir próximo passo baseado no estado atual do projeto

## Output

Variável `mode` ∈ {`list`, `match`, `next`}. Encaminha para o Step 03.
