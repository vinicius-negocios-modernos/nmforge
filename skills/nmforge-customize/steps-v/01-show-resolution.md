# Step 01 — Mostrar resolução final

## Objetivo

Confirmar que as 3 camadas, mescladas na ordem correta, produzem o resultado esperado.

## Comando

```bash
node -e "
import('@nmforge/customize-resolver').then(async ({resolveCustomize}) => {
  const r = await resolveCustomize({
    layers: [
      '.nmforge/customize.toml',
      process.env.HOME + '/.config/nmforge/customize.toml',
      './customize.local.toml',
    ],
  });
  console.log('Layers used:', r.layersUsed);
  console.log('Merged:', JSON.stringify(r.merged, null, 2));
  if (r.errors.length) console.error('Errors:', r.errors);
});
"
```

## Reporte

- Liste camadas efetivamente lidas (ENOENT é silencioso).
- Mostre objeto mesclado.
- Se houve erros de parse, destaque em vermelho e oriente fix.
- Confirme com o usuário se o `merged` reflete a intenção.
