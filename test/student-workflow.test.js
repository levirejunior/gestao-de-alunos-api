import request from 'supertest';
import { expect } from 'chai';
import { loginAdmin, loginAluno } from './helpers/auth.helper';
import testData from './data/testData.json';
import 'dotenv/config';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const app = request(API_URL);

describe('Suíte de Testes: Fluxo de Gestão de Alunos e Entrega de Trabalhos', () => {
  let adminToken = '';

  // 1. Logar como Administrador
  describe('Autenticação de Administrador', () => {
    it('Deve realizar login como Admin com sucesso e obter token', async () => {
      const auth = await loginAdmin(app, testData.adminCredentials);

      expect(auth.status).to.equal(200);
      expect(auth.token).to.be.a('string');
      adminToken = auth.token;
    });
  });

  // 2. Data-Driven Testing: Cadastrar Alunos, Logar e Entregar Trabalhos
  describe('Fluxo do Aluno (Data-Driven)', () => {

    testData.studentsToCreate.forEach((student, index) => {
      describe(`Testando com Aluno ${index + 1}: ${student.nome}`, () => {
        let studentToken = '';
        let createdStudentId = null;

        it('Deve cadastrar o aluno via painel admin', async () => {
          const response = await app
            .post('/api/admin/alunos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(student);

          expect([200, 201]).to.include(response.status);
          expect(response.body).to.have.property('id');
          createdStudentId = response.body.id;
        });

        it('Deve realizar login com as credenciais do aluno cadastrado', async () => {
          const auth = await loginAluno(app, {
            email: student.email,
            senha: student.senha
          });

          expect(auth.status).to.equal(200);
          expect(auth.token).to.be.a('string');
          studentToken = auth.token;
        });

        it('Deve registrar a entrega de um trabalho como aluno', async () => {
          const assignment = testData.assignments[0];

          const response = await app
            .post('/api/trabalhos/entregas')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
              titulo: assignment.titulo,
              conteudo: assignment.conteudo
            });

          expect([200, 201]).to.include(response.status);
          expect(response.body).to.have.property('id');
        });
      });
    });

  });
});