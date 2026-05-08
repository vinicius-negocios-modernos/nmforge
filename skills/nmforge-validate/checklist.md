# Checklist — nmforge-validate

- [ ] Comando exato é mostrado antes de executar (sem mágica oculta)
- [ ] Saída é traduzida: cada violação vira ação concreta
- [ ] Distinção clara entre warn (triagem) e fail (bloqueia)
- [ ] Em modo `--strict`, comportamento é explicado ao usuário
- [ ] Loop fix-validate não excede 3 iterações sem reportar progresso
- [ ] Esta skill em si passa `nmforge validate --skill nmforge-validate`
