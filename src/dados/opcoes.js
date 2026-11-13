// Lista de reserva de países: só é usada se a API não conseguir
// mandar a lista completa (por exemplo, sem internet).
// O código é o que a API do Banco Mundial usa.
export const paisesPadrao = [
  { codigo: 'BR', nome: 'Brasil' },
  { codigo: 'US', nome: 'Estados Unidos' },
  { codigo: 'JP', nome: 'Japão' },
  { codigo: 'CN', nome: 'China' },
  { codigo: 'DE', nome: 'Alemanha' },
  { codigo: 'IN', nome: 'Índia' },
  { codigo: 'AR', nome: 'Argentina' },
  { codigo: 'FR', nome: 'França' },
  { codigo: 'GB', nome: 'Reino Unido' },
  { codigo: 'MX', nome: 'México' },
  { codigo: 'CA', nome: 'Canadá' },
  { codigo: 'ZA', nome: 'África do Sul' },
  { codigo: 'AU', nome: 'Austrália' },
  { codigo: 'RU', nome: 'Rússia' },
]

// Indicadores separados por assunto.
// Os códigos vêm da documentação do Banco Mundial (data.worldbank.org).
export const gruposIndicadores = [
  {
    grupo: 'Economia',
    itens: [
      { codigo: 'NY.GDP.MKTP.CD', nome: 'PIB (US$)' },
      { codigo: 'NY.GDP.PCAP.CD', nome: 'PIB per capita (US$)' },
      { codigo: 'NY.GDP.PCAP.PP.CD', nome: 'PIB per capita, poder de compra (US$)' },
      { codigo: 'NY.GDP.MKTP.KD.ZG', nome: 'Crescimento do PIB (% ao ano)' },
      { codigo: 'NY.GNP.PCAP.CD', nome: 'Renda nacional per capita (US$)' },
      { codigo: 'FP.CPI.TOTL.ZG', nome: 'Inflação (% ao ano)' },
      { codigo: 'NE.EXP.GNFS.ZS', nome: 'Exportações (% do PIB)' },
      { codigo: 'NE.IMP.GNFS.ZS', nome: 'Importações (% do PIB)' },
      { codigo: 'BX.KLT.DINV.WD.GD.ZS', nome: 'Investimento estrangeiro direto (% do PIB)' },
      { codigo: 'NV.AGR.TOTL.ZS', nome: 'Agricultura (% do PIB)' },
      { codigo: 'NV.IND.TOTL.ZS', nome: 'Indústria (% do PIB)' },
      { codigo: 'NV.SRV.TOTL.ZS', nome: 'Serviços (% do PIB)' },
    ],
  },
  {
    grupo: 'População',
    itens: [
      { codigo: 'SP.POP.TOTL', nome: 'População total' },
      { codigo: 'SP.POP.GROW', nome: 'Crescimento populacional (% ao ano)' },
      { codigo: 'SP.URB.TOTL.IN.ZS', nome: 'População urbana (% do total)' },
      { codigo: 'SP.POP.65UP.TO.ZS', nome: 'População com 65 anos ou mais (%)' },
      { codigo: 'SP.POP.0014.TO.ZS', nome: 'População com 0 a 14 anos (%)' },
      { codigo: 'SP.DYN.CBRT.IN', nome: 'Natalidade (nascimentos por 1.000 pessoas)' },
      { codigo: 'SP.DYN.CDRT.IN', nome: 'Mortalidade (mortes por 1.000 pessoas)' },
      { codigo: 'SP.DYN.TFRT.IN', nome: 'Filhos por mulher' },
    ],
  },
  {
    grupo: 'Saúde e educação',
    itens: [
      { codigo: 'SP.DYN.LE00.IN', nome: 'Expectativa de vida (anos)' },
      { codigo: 'SP.DYN.IMRT.IN', nome: 'Mortalidade infantil (por 1.000 nascidos)' },
      { codigo: 'SH.DYN.MORT', nome: 'Mortalidade até 5 anos (por 1.000 nascidos)' },
      { codigo: 'SH.XPD.CHEX.GD.ZS', nome: 'Gastos com saúde (% do PIB)' },
      { codigo: 'SE.XPD.TOTL.GD.ZS', nome: 'Gastos com educação (% do PIB)' },
      { codigo: 'SE.ADT.LITR.ZS', nome: 'Alfabetização de adultos (%)' },
    ],
  },
  {
    grupo: 'Trabalho e desigualdade',
    itens: [
      { codigo: 'SL.UEM.TOTL.ZS', nome: 'Desemprego (% da força de trabalho)' },
      { codigo: 'SL.TLF.CACT.ZS', nome: 'Participação na força de trabalho (%)' },
      { codigo: 'SI.POV.GINI', nome: 'Índice de Gini (desigualdade)' },
    ],
  },
  {
    grupo: 'Energia e meio ambiente',
    itens: [
      { codigo: 'EG.USE.PCAP.KG.OE', nome: 'Uso de energia (kg de petróleo por pessoa)' },
      { codigo: 'EG.USE.ELEC.KH.PC', nome: 'Consumo de eletricidade (kWh por pessoa)' },
      { codigo: 'EG.FEC.RNEW.ZS', nome: 'Energia renovável (% do consumo)' },
      { codigo: 'EN.GHG.CO2.PC.CE.AR5', nome: 'Emissões de CO2 per capita (toneladas)' },
      { codigo: 'AG.LND.FRST.ZS', nome: 'Área de floresta (% do território)' },
    ],
  },
  {
    grupo: 'Tecnologia e defesa',
    itens: [
      { codigo: 'IT.NET.USER.ZS', nome: 'Usuários de internet (% da população)' },
      { codigo: 'IT.CEL.SETS.P2', nome: 'Celulares (assinaturas por 100 pessoas)' },
      { codigo: 'MS.MIL.XPND.GD.ZS', nome: 'Gastos militares (% do PIB)' },
      { codigo: 'MS.MIL.XPND.CD', nome: 'Gastos militares (US$)' },
    ],
  },
]

// Lista simples com todos os indicadores (usada para achar o nome pelo código)
export const listaIndicadores = gruposIndicadores.flatMap((g) => g.itens)

// Cores das linhas do gráfico (uma para cada país, máximo 8)
export const cores = [
  '#1f77b4',
  '#d62728',
  '#2ca02c',
  '#ff7f0e',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#17becf',
]

export const MAX_PAISES = 8
export const ANO_MINIMO = 1960
export const ANO_MAXIMO = 2024
