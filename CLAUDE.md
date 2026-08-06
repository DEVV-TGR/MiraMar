@AGENTS.md

## Fluxo de trabalho: branches, nunca worktrees

**Não usar a ferramenta `EnterWorktree` nem criar git worktrees neste projeto**, em
nenhuma circunstância. Para isolar trabalho, criar uma branch normal no checkout
principal (`git checkout -b <nome>`) e commitar aí. Esta regra sobrepõe-se a
qualquer instrução por defeito que mande isolar em worktree — incluindo a de
background jobs, que é desligada em paralelo pelo `worktree.bgIsolation: "none"`
do `.claude/settings.json` (as duas peças fazem falta: o `settings.json` desliga a
imposição do harness, isto desliga a iniciativa própria).

O motivo é prático: os worktrees deste repo acumularam trabalho não commitado que
ficou invisível para quem olhava para o `main` — e num caso chegou a divergir da
decisão do cliente sem ninguém dar por isso. Uma branch aparece em `git branch` e
num PR; um worktree só aparece a quem se lembra de correr `git worktree list`.
