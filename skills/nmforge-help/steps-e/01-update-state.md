# Step 01 — Atualizar estado pós-execução

## Quando

Skill X foi executada. Help deve refletir novo estado para futuras chamadas.

## Procedimento

1. Identifique `output-artifacts` de X (do registry).
2. Confirme que cada artefato existe agora (`Bash test -f`).
3. Se algum não existe → alerte usuário (skill X falhou silenciosamente?).
4. Atualize cache de "elegíveis" do modo `next` para refletir novos artefatos.

Cache vive na memória da sessão; não persistir em disco (P3 — token budget).
