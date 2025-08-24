import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  List,
  Button,
  IconButton,
  Divider,
  Text,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getMaterials, deleteMaterial } from '../../services/materialService';
import { Material } from '../../types/interfaces';
import MaterialForm from '../../components/MaterialForm';

const MaterialsScreen = ({ navigation }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const materialsData = await getMaterials();
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMaterials();
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      fetchMaterials(); // Refresh list after deleting
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleSave = () => {
    setModalVisible(false);
    fetchMaterials();
  };

  const renderItem = ({ item }: { item: Material }) => (
    <>
      <List.Item
        title={item.materialName}
        description={`Cost: $${item.defaultUnitCost.toFixed(
          2
        )} | Markup: ${item.defaultMarkupPercent}%`}
        right={() => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon="pencil"
              onPress={() => {
                setSelectedMaterial(item);
                setModalVisible(true);
              }}
            />
            <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
      <Divider />
    </>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading materials...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={materials}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        mode="contained"
        onPress={() => {
          setSelectedMaterial(null);
          setModalVisible(true);
        }}
        style={styles.addButton}
      >
        Add Material
      </Button>
      <MaterialForm
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSave}
        material={selectedMaterial}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    margin: 16,
  },
});

export default MaterialsScreen;
