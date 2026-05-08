# Checklist — nmforge-doctor

- [ ] CLI `nmforge doctor` foi invocado primeiro
- [ ] Deep checks rodaram em paralelo (subagents) quando projeto > 20 skills
- [ ] Relatório separa achados por severidade (info / warn / fail)
- [ ] Cada fail vem com fix sugerido
- [ ] Refs órfãs foram cross-referenced contra registry real
- [ ] Modelos legados detectados (se houver) listam path:line
- [ ] Esta skill passa `nmforge validate --skill nmforge-doctor`
