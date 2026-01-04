const users = [
  { email: 'admin@fon.com.br', senha: 'admin123', nome: 'Administrador', perfil: 'admin' },
  { email: 'gerente@fon.com.br', senha: 'gerente123', nome: 'Gerente', perfil: 'gerente' },
  { email: 'test@example.com', senha: 'test123', nome: 'Teste', perfil: 'usuario' }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }
  
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }
    
    const usuario = users.find(u => u.email === email && u.senha === senha);
    
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
    
    return res.status(200).json({
      usuario: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      token: Buffer.from(email).toString('base64')
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
