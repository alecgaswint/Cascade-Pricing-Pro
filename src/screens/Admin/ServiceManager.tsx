import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, TextInput, List, Modal, Portal, Provider, FAB } from 'react-native-paper';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Service } from '../../types/interfaces';

const ServiceManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      setServices(servicesData);
    });
    return () => unsubscribe();
  }, []);

  const showModal = (service: Partial<Service> | null = null) => {
    setCurrentService(service);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setCurrentService(null);
  };

  const handleSave = async () => {
    if (currentService) {
      const { id, ...data } = currentService;
      const serviceData = {
        ...data,
        estimatedLaborTime: Number(data.estimatedLaborTime) || 0,
        crewSize: Number(data.crewSize) || 0,
        equipmentEmbeddedCosts: Number(data.equipmentEmbeddedCosts) || 0,
      };

      if (id) {
        await updateDoc(doc(db, 'services', id), serviceData);
      } else {
        await addDoc(collection(db, 'services'), serviceData);
      }
      hideModal();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
  };

  const handleInputChange = (name: keyof Service, value: string) => {
    if (currentService) {
      setCurrentService({ ...currentService, [name]: value });
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <TextInput
              label="Service Name"
              value={currentService?.serviceName || ''}
              onChangeText={(text) => handleInputChange('serviceName', text)}
              style={styles.input}
            />
            <TextInput
              label="Category"
              value={currentService?.category || ''}
              onChangeText={(text) => handleInputChange('category', text)}
              style={styles.input}
            />
            <TextInput
              label="Estimated Labor Time"
              value={String(currentService?.estimatedLaborTime || '')}
              onChangeText={(text) => handleInputChange('estimatedLaborTime', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Crew Size"
              value={String(currentService?.crewSize || '')}
              onChangeText={(text) => handleInputChange('crewSize', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Equipment Embedded Costs"
              value={String(currentService?.equipmentEmbeddedCosts || '')}
              onChangeText={(text) => handleInputChange('equipmentEmbeddedCosts', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSave}>Save</Button>
          </Modal>
        </Portal>

        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.serviceName}
              description={`Category: ${item.category}, Labor Time: ${item.estimatedLaborTime}h`}
              right={() => (
                <>
                  <Button onPress={() => showModal(item)}>Edit</Button>
                  <Button onPress={() => handleDelete(item.id)}>Delete</Button>
                </>
              )}
            />
          )}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => showModal({ serviceName: '', category: '', estimatedLaborTime: 0, crewSize: 0, equipmentEmbeddedCosts: 0 })}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
  },
  input: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ServiceManager;
