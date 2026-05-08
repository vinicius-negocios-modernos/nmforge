# Checklist — nmforge-skill-create

Critérios de aceitação. Cada item é verificável em `steps-v/`.

- [ ] Nome da skill em kebab-case e casa com basename do diretório (R-DET-01)
- [ ] Frontmatter contém `description` com substring `Use when:` (R-DET-02)
- [ ] `allowed-tools` declara apenas tools válidas do Claude Code 2.1.x (R-DET-03)
- [ ] Arquivo `checklist.md` presente na pasta da skill (R-DET-10)
- [ ] Frontmatter YAML é parseável (R-DET-12)
- [ ] SKILL.md tem ≤ 200 linhas (R-OP47-02)
- [ ] Body cabe em `token_budget × 1.2` (R-OP47-06)
- [ ] Pelo menos um arquivo em `steps-c/`, `steps-e/`, `steps-v/`
- [ ] `nmforge validate --skill <name>` retorna exit code 0
- [ ] Usuário documentou propósito real (substituiu placeholders TODO)
