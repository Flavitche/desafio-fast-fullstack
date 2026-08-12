// Converte uma data vinda da API (ex: "2026-02-12" ou "2026-02-12T00:00:00")
// em um Date interpretado no fuso horário LOCAL do navegador.
//
// Por que isso é necessário: `new Date("2026-02-12")` é interpretado pelo
// JavaScript como meia-noite em UTC. Em fusos horários negativos (como o do
// Brasil, UTC-3), ao chamar `.getDate()` sobre esse valor, o dia exibido
// pode "voltar" um dia (12 vira 11). Extraindo ano/mês/dia diretamente da
// string e montando o Date com `new Date(ano, mes, dia)`, evitamos essa
// conversão de fuso horário.
export function parseDataLocal(valor) {
  if (!valor) return new Date(NaN);
  const soData = String(valor).split('T')[0];
  const [ano, mes, dia] = soData.split('-').map(Number);
  if (!ano || !mes || !dia) return new Date(NaN);
  // new Date(ano, mes - 1, dia) usa o fuso horário LOCAL do navegador,
  // diferente de new Date(string), que assume UTC. É essa troca que evita
  // o bug do dia "voltando" um dia em fusos horários negativos.
  return new Date(ano, mes - 1, dia);
}