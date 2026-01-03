// Teste de integração simples para o backend FON
// Requisitos: Node 18+ (fetch global disponível)

const BASE = process.env.BASE || 'http://localhost:3000';

function hojeISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function run() {
  try {
    console.log('1) Testando /api/health...');
    const h = await fetch(`${BASE}/api/health`);
    const hjson = await h.json();
    if (!hjson || hjson.status !== 'ok') throw new Error('health status inválido: ' + JSON.stringify(hjson));
    console.log('  → /api/health ok');

    console.log('2) Testando /api/auth/login...');
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fon.com.br', senha: 'admin123' })
    });
    if (!loginRes.ok) throw new Error('/api/auth/login retornou ' + loginRes.status);
    const loginJson = await loginRes.json();
    if (!loginJson.token) throw new Error('token ausente no login');
    const token = loginJson.token;
    console.log('  → login ok (token obtido)');

    console.log('3) Criando uma intermediação de teste...');
    const payload = {
      data: hojeISO(),
      tipo: 'Intermediação',
      pv: 9999,
      ref: 999,
      empreendimento: 'TESTE',
      unidade: 'X-01',
      valor: 1234.56,
      taxaPercent: 2,
      corretor: 'test',
      sup: 'sup',
      diretoria: 'dir',
      rPrincipal: 0,
      rFon: 0,
      rCanela: 0,
      rCentral: 0,
      status: 'Reserva/Pré'
    };

    const createRes = await fetch(`${BASE}/api/intermediacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(payload)
    });
    if (!createRes.ok) throw new Error('Falha ao criar intermediação: ' + createRes.status);
    const createJson = await createRes.json();
    if (!createJson.ok || !createJson.item || !createJson.item.id) throw new Error('Resposta de criação inválida: ' + JSON.stringify(createJson));
    const id = createJson.item.id;
    console.log('  → intermediação criada com id', id);

    console.log('4) Listando intermediações e verificando presença...');
    const listRes = await fetch(`${BASE}/api/intermediacoes`, { headers: { 'Authorization': 'Bearer ' + token } });
    if (!listRes.ok) throw new Error('Falha ao listar intermediações: ' + listRes.status);
    const listJson = await listRes.json();
    const found = listJson.items && listJson.items.find(x => String(x.id) === String(id));
    if (!found) throw new Error('Item criado não encontrado na listagem');
    console.log('  → item presente na listagem');

    console.log('5) Excluindo intermediação de teste...');
    const delRes = await fetch(`${BASE}/api/intermediacoes/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
    if (!delRes.ok) throw new Error('Falha ao deletar item: ' + delRes.status);
    console.log('  → item excluído com sucesso');

    console.log('\nTodos os testes passaram ✅');
    process.exit(0);
  } catch (e) {
    console.error('Erro nos testes:', e.message || e);
    process.exit(1);
  }
}

run();
