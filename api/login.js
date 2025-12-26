module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const users = {
      'admin@fon.com.br': { senha: 'admin123', nome: 'Administrador', perfil: 'admin' },
      'gerente@fon.com.br': { senha: 'gerente123', nome: 'Gerente', perfil: 'gerente' },
      'test@example.com': { senha: '123456', nome: 'Usuário Teste', perfil: 'user' }
    };

    const user = users[email];
    if (!user || user.senha !== senha) return res.status(401).json({ error: 'Email ou senha inválidos' });

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      usuario: { email, nome: user.nome, perfil: user.perfil },
      token: Buffer.from(JSON.stringify({ email, nome: user.nome })).toString('base64')
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar login', details: error.message });
  }
};
