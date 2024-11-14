import { db } from './firebase.js';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// Função para obter exercícios com filtros
export async function obterExercicios({ categoria } = {}) {
  const exerciciosRef = collection(db, 'exercicios');

  let q = query(exerciciosRef);

  // Filtrar por categoria
  if (categoria && categoria !== 'Todos') {
    q = query(q, where('categoria', 'in', [categoria, 'Todos']));
  }

  const querySnapshot = await getDocs(q);

  // Mapear para dados e adicionar o campo 'id'
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Função para adicionar exercício
export async function adicionarExercicio(exercicio) {
  const exerciciosRef = collection(db, 'exercicios');
  await addDoc(exerciciosRef, exercicio);
}

// Função para atualizar exercício
export async function atualizarExercicio(id, dadosAtualizados) {
  const exercicioDoc = doc(db, 'exercicios', id);
  await updateDoc(exercicioDoc, dadosAtualizados);
}

// Função para deletar exercício
export async function deletarExercicio(id) {
  const exercicioDoc = doc(db, 'exercicios', id);
  await deleteDoc(exercicioDoc);
}
