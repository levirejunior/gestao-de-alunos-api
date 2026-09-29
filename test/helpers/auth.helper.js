
/**
 * Autentica o administrador e retorna o token JWT.
 */
export async function loginAdmin(requestApp, credentials) {
  const response = await requestApp
    .post('/api/auth/login')
    .send({
      email: credentials.email,
      senha: credentials.senha,
      tipo: 'admin'
    });

  return {
    status: response.status,
    token: response.body.token,
    body: response.body
  };
}

/**
 * Autentica um aluno/usuário e retorna o token JWT.
 */
export async function loginAluno(requestApp, credentials) {
  const response = await requestApp
    .post('/api/auth/login')
    .send({
      email: credentials.email,
      senha: credentials.senha,
      tipo: 'aluno'
    });

  return {
    status: response.status,
    token: response.body.token,
    body: response.body
  };
}

export default { loginAdmin, loginAluno };