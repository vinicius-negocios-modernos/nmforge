# Checklist — nmforge-help

- [ ] Registry foi montado a partir do filesystem real (não cache stale)
- [ ] Resposta indica claramente qual modo foi usado (lista / match / próximo)
- [ ] Quando há ambiguidade, `AskUserQuestion` foi usado em vez de chutar
- [ ] Sugestão de próxima skill cita os artefatos que ela espera
- [ ] Modules externos respeitam `show_external_modules`
- [ ] Esta skill passa `nmforge validate --skill nmforge-help`
