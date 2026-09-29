import mongoose from 'mongoose';
import Alunos from '../../src/models/aluno.model.js';
import Matriculas from '../../src/models/matricula.model.js';

export async function limparColecao() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestao-de-alunos');

    // Apaga TODOS os documentos da coleção "alunos e matriculas"
    const resultadoAlunos = await Alunos.deleteMany({});
    const resultadoMatriculas = await Matriculas.deleteMany({});

    //console.log(`Coleção de Alunos limpa com sucesso! Documentos removidos: ${resultadoAlunos.deletedCount}`);
    //console.log(`Coleção Matriculas limpa com sucesso! Documentos removidos: ${resultadoMatriculas.deletedCount}`);
    
    await mongoose.connection.close();
  } catch (erro) {
    console.error('Erro ao limpar as coleções:', erro);
  }

}

export default { limparColecao };