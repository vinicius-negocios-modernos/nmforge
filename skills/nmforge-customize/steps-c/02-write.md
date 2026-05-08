# Step 02 — Gravar arquivo TOML

## Pré-condições

- `target_path` resolvido (Step 01)
- Confirmação do usuário se `confirm_writes = true`

## Procedimento

1. Se o arquivo já existir → use Step `steps-e/01-edit-key.md` (caminho de Edit).
2. Se não existir, monte o conteúdo:

```toml
# <target_path>
# Camada: <team|user|local>
# Gerado por nmforge-customize em <data>

[<skill-name>.defaults]
<key> = <value>
```

3. Crie o diretório pai se necessário (`Bash mkdir -p $(dirname <target_path>)`).
4. Use `Write` para criar o arquivo.

## Pós-condição

- Confirmação visual ao usuário com path absoluto
- Se camada = `local`, lembrar de confirmar `.gitignore`
