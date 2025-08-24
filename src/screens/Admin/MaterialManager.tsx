import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, TextInput, List, Modal, Portal, Provider, FAB } from 'react-native-paper';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Material } from '../../types/interfaces';

const MaterialManager = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material> | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'materials'), (snapshot) => {
      const materialsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Material[];
      setMaterials(materialsData);
    });
    return () => unsubscribe();
  }, []);

  const showModal = (material: Partial<Material> | null = null) => {
    setCurrentMaterial(material);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setCurrentMaterial(null);
  };

  const handleSave = async () => {
    if (currentMaterial) {
      const { id, ...data } = currentMaterial;
      const materialData = {
        ...data,
        defaultUnitCost: Number(data.defaultUnitCost) || 0,
        defaultMarkupPercent: Number(data.defaultMarkupPercent) || 0,
      };

      if (id) {
        await updateDoc(doc(db, 'materials', id), materialData);
      } else {
        await addDoc(collection(db, 'materials'), materialData);
      }
      hideModal();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'materials', id));
  };

  const handleInputChange = (name: keyof Material, value: string) => {
    if (currentMaterial) {
      setCurrentMaterial({ ...currentMaterial, [name]: value });
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <TextInput
              label="Material Name"
              value={currentMaterial?.materialName || ''}
              onChangeText={(text) => handleInputChange('materialName', text)}
              style={styles.input}
            />
            <TextInput
              label="Default Unit Cost"
              value={String(currentMaterial?.defaultUnitCost || '')}
              onChangeText={(text) => handleInputChange('defaultUnitCost', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Default Markup Percent"
              value={String(currentMaterial?.defaultMarkupPercent || '')}
              onChangeText={(text) => handleInputChange('defaultMarkupPercent', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSave}>Save</Button>
          </Modal>
        </Portal>

        <FlatList
          data={materials}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.materialName}
              description={`Cost: ${item.defaultUnitCost}, Markup: ${item.defaultMarkupPercent}%`}
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
          onPress={() => showModal({ materialName: '', defaultUnitCost: 0, defaultMarkupPercent: 0 })}
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

export default MaterialManager;
