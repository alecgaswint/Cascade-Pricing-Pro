import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Material } from '../types/interfaces';

const materialsCollection = collection(db, 'materials');

export const getMaterials = async (): Promise<Material[]> => {
  const snapshot = await getDocs(materialsCollection);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Material)
  );
};

export const addMaterial = async (
  material: Omit<Material, 'id'>
): Promise<string> => {
  const docRef = await addDoc(materialsCollection, material);
  return docRef.id;
};

export const updateMaterial = async (
  id: string,
  material: Partial<Material>
): Promise<void> => {
  const materialDoc = doc(db, 'materials', id);
  await updateDoc(materialDoc, material);
};

export const deleteMaterial = async (id: string): Promise<void> => {
  const materialDoc = doc(db, 'materials', id);
  await deleteDoc(materialDoc);
};
