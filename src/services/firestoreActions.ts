import { db } from '../config/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Service } from '../types/interfaces';

const servicesCollection = collection(db, 'services');

export const getServices = async (): Promise<Service[]> => {
    const snapshot = await getDocs(servicesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
};

export const addService = async (service: Omit<Service, 'id'>) => {
    return await addDoc(servicesCollection, service);
};

export const updateService = async (id: string, service: Partial<Service>) => {
    const serviceDoc = doc(db, 'services', id);
    return await updateDoc(serviceDoc, service);
};

export const deleteService = async (id: string) => {
    const serviceDoc = doc(db, 'services', id);
    return await deleteDoc(serviceDoc);
};
