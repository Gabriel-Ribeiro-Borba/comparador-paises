import { useState, useEffect, useRef } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  paisesPadrao,
  gruposIndicadores,
  listaIndicadores,
  cores,
  MAX_PAISES,
  ANO_MINIMO,
  ANO_MAXIMO,
} from './dados/opcoes'

const URL_BASE = 'https://api.worldbank.org/v2'


function formatarNumero(n) {
  if (n === null || n === undefined) return '-'
  const abs = Math.abs(n)
  if (abs >= 1e12) return (n / 1e12).toFixed(2).replace('.', ',') + ' tri'
  if (abs >= 1e9) return (n / 1e9).toFixed(2).replace('.', ',') + ' bi'
  if (abs >= 1e6) return (n / 1e6).toFixed(2).replace('.', ',') + ' mi'
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
}


const tradutor = new Intl.DisplayNames(['pt-BR'], { type: 'region' })

function traduzirNome(codigo, nomeEmIngles) {
  try {
    const nome = tradutor.of(codigo)
    if (nome && nome !== codigo) return nome
  } catch {
    // se der erro usa o nome em inglês mesmo
  }
  return nomeEmIngles || codigo
}


async function buscarListaDePaises() {
  const resposta = await fetch(URL_BASE + '/country?format=json&per_page=400')
  if (!resposta.ok) throw new Error('Erro ' + resposta.status)
  const json = await resposta.json()

  return (
    json[1]
    
      .filter((p) => p.region.id !== 'NA')
      .map((p) => ({ codigo: p.iso2Code, nome: traduzirNome(p.iso2Code, p.name) }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  )
}


async function buscarIndicador(pais, indicador) {
  const url =
    URL_BASE +
    '/country/' +
    pais +
    '/indicator/' +
    indicador +
    '?format=json&per_page=100&date=' +
    ANO_MINIMO +
    ':' +
    ANO_MAXIMO

  const resposta = await fetch(url)
  if (!resposta.ok) throw new Error('Erro ' + resposta.status)
  const json = await resposta.json()

  
  if (json[0] && json[0].message) {
    throw new Error(json[0].message[0].value)
  }

  const valores = {}
  
  ;(json[1] || []).forEach((item) => {
    if (item.value !== null) {
      valores[item.date] = item.value
    }
  })
  return valores
}


function lerListaSalva() {
  try {
    const salvo = localStorage.getItem('listaPaises')
    return salvo ? JSON.parse(salvo) : null
  } catch {
    return null
  }
}

function App() {
  const [listaSalva] = useState(lerListaSalva)
  const [listaPaises, setListaPaises] = useState(listaSalva || paisesPadrao)
  const [carregandoPaises, setCarregandoPaises] = useState(!listaSalva)
  const [busca, setBusca] = useState('')

  const [paisesEscolhidos, setPaisesEscolhidos] = useState(['BR', 'US', 'JP'])
  const [indicador, setIndicador] = useState('NY.GDP.MKTP.CD')
  const [anoInicial, setAnoInicial] = useState(2000)
  const [anoFinal, setAnoFinal] = useState(2023)
  const [erro, setErro] = useState('')

  

  const [cache, setCache] = useState({})
  const emAndamento = useRef({}) 

  
  useEffect(() => {
    if (listaSalva) return

    buscarListaDePaises()
      .then((lista) => {
        setListaPaises(lista)
        try {
          localStorage.setItem('listaPaises', JSON.stringify(lista))
        } catch {
          
        }
      })
      .catch((e) => console.log('Não consegui a lista de países, usando a lista pequena', e))
      .finally(() => setCarregandoPaises(false))
  }, [listaSalva])


  useEffect(() => {
    if (erro) return

    paisesEscolhidos.forEach((pais) => {
      const chave = pais + '|' + indicador
      if (cache[chave] || emAndamento.current[chave]) return

      emAndamento.current[chave] = true
      buscarIndicador(pais, indicador)
        .then((valores) => {
          setCache((antigo) => ({ ...antigo, [chave]: valores }))
        })
        .catch((e) => {
          console.log(e)
          setErro('Não foi possível carregar os dados. (' + e.message + ')')
        })
        .finally(() => {
          delete emAndamento.current[chave]
        })
    })
  }, [paisesEscolhidos, indicador, cache, erro])

  function nomeDoPais(codigo) {
    const pais = listaPaises.find((p) => p.codigo === codigo)
    return pais ? pais.nome : traduzirNome(codigo, codigo)
  }

  
  function mudarPais(codigo) {
    setErro('')
    if (paisesEscolhidos.includes(codigo)) {
      setPaisesEscolhidos(paisesEscolhidos.filter((p) => p !== codigo))
    } else {
      if (paisesEscolhidos.length >= MAX_PAISES) {
        alert('Escolha no máximo ' + MAX_PAISES + ' países!')
        return
      }
      setPaisesEscolhidos([...paisesEscolhidos, codigo])
    }
  }

  function mudarIndicador(novo) {
    setErro('')
    setIndicador(novo)
  }


  const faltando = paisesEscolhidos.filter((p) => !cache[p + '|' + indicador])
  const carregando = faltando.length > 0 && !erro
  const anosInvalidos = anoInicial > anoFinal

  const dados = []
  if (!anosInvalidos) {
    for (let ano = anoInicial; ano <= anoFinal; ano++) {
      const linha = { ano: ano }
      let temAlgumValor = false
      paisesEscolhidos.forEach((pais) => {
        const valores = cache[pais + '|' + indicador]
        if (valores && valores[ano] !== undefined) {
          linha[pais] = valores[ano]
          temAlgumValor = true
        }
      })
      if (temAlgumValor) {
        dados.push(linha)
      }
    }
  }

  
  const ultimosValores = paisesEscolhidos.map((codigo) => {
    let valor = null
    for (let i = dados.length - 1; i >= 0; i--) {
      if (dados[i][codigo] !== undefined) {
        valor = dados[i][codigo]
        break
      }
    }
    return { nome: nomeDoPais(codigo), valor: valor }
  })

  const nomeIndicador = listaIndicadores.find((i) => i.codigo === indicador).nome

  const anos = []
  for (let a = ANO_MINIMO; a <= ANO_MAXIMO; a++) {
    anos.push(a)
  }

 
  const paisesFiltrados = listaPaises.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="container">
      <h1>Comparador de Países</h1>
      <p>
        Escolha países e um indicador para comparar. Os dados vêm da API do
        Banco Mundial.
      </p>

      <div className="caixa">
        <h3>
          1. Escolha os países (máx. {MAX_PAISES}) - {listaPaises.length} disponíveis
        </h3>

        <p>
          Selecionados:{' '}
          {paisesEscolhidos.length === 0 && <i>nenhum</i>}
          {paisesEscolhidos.map((codigo, i) => (
            <button
              key={codigo}
              className="selecionado"
              style={{ borderColor: cores[i] }}
              onClick={() => mudarPais(codigo)}
              title="Clique para remover"
            >
              {nomeDoPais(codigo)} X
            </button>
          ))}
        </p>

        <input
          type="text"
          placeholder="Digite para procurar um país..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="busca"
        />
        {carregandoPaises && <span> Carregando lista de países...</span>}

        <div className="lista-paises">
          {paisesFiltrados.map((pais) => (
            <label key={pais.codigo}>
              <input
                type="checkbox"
                checked={paisesEscolhidos.includes(pais.codigo)}
                onChange={() => mudarPais(pais.codigo)}
              />
              {pais.nome}
            </label>
          ))}
          {paisesFiltrados.length === 0 && <p>Nenhum país encontrado.</p>}
        </div>
      </div>

      <div className="caixa">
        <h3>2. Escolha o indicador e o período</h3>
        <select value={indicador} onChange={(e) => mudarIndicador(e.target.value)}>
          {gruposIndicadores.map((grupo) => (
            <optgroup key={grupo.grupo} label={grupo.grupo}>
              {grupo.itens.map((ind) => (
                <option key={ind.codigo} value={ind.codigo}>
                  {ind.nome}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        De:
        <select
          value={anoInicial}
          onChange={(e) => setAnoInicial(Number(e.target.value))}
        >
          {anos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        Até:
        <select
          value={anoFinal}
          onChange={(e) => setAnoFinal(Number(e.target.value))}
        >
          {anos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando dados...</p>}
      {erro && (
        <p className="erro">
          {erro} <button onClick={() => setErro('')}>Tentar de novo</button>
        </p>
      )}
      {anosInvalidos && (
        <p className="erro">O ano inicial não pode ser maior que o ano final.</p>
      )}
      {paisesEscolhidos.length === 0 && <p>Selecione pelo menos um país.</p>}
      {!carregando && !erro && !anosInvalidos && paisesEscolhidos.length > 0 && dados.length === 0 && (
        <p>Não há dados desse indicador para os países e anos escolhidos.</p>
      )}

      {dados.length > 0 && (
        <div>
          <div className="caixa">
            <h3>Evolução ao longo dos anos: {nomeIndicador}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ano" />
                <YAxis tickFormatter={formatarNumero} width={80} />
                <Tooltip formatter={(valor) => formatarNumero(valor)} />
                <Legend />
                {paisesEscolhidos.map((codigo, i) => (
                  <Line
                    key={codigo}
                    type="monotone"
                    dataKey={codigo}
                    name={nomeDoPais(codigo)}
                    stroke={cores[i]}
                    connectNulls={true}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="caixa">
            <h3>Último valor disponível de cada país</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ultimosValores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis tickFormatter={formatarNumero} width={80} />
                <Tooltip formatter={(valor) => formatarNumero(valor)} />
                <Bar
                  dataKey="valor"
                  name={nomeIndicador}
                  fill="#1f77b4"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="caixa">
            <h3>Tabela com os valores</h3>
            <div className="tabela-rolagem">
              <table>
                <thead>
                  <tr>
                    <th>Ano</th>
                    {paisesEscolhidos.map((codigo) => (
                      <th key={codigo}>{nomeDoPais(codigo)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* mostra do ano mais novo para o mais antigo */}
                  {[...dados].reverse().map((linha) => (
                    <tr key={linha.ano}>
                      <td>{linha.ano}</td>
                      {paisesEscolhidos.map((codigo) => (
                        <td key={codigo}>{formatarNumero(linha[codigo])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
    </div>
  )
}

export default App
