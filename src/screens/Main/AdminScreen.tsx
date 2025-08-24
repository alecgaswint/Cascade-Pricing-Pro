import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import ServiceList from '../../components/ServiceList';
import ServiceModal from '../../components/ServiceModal';
import { addService, updateService } from '../../services/firestoreActions';
import { Service } from '../../types/interfaces';
import { useFocusEffect } from '@react-navigation/native';

const AdminScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Omit<Service, 'id'> | Service | null>(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleAdd = () => {
    setSelectedService(null);
    setModalVisible(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleDismiss = () => {
    setModalVisible(false);
    setSelectedService(null);
  };

  const handleSave = async (service: Omit<Service, 'id'> | Service) => {
    try {
      if (selectedService && 'id' in selectedService) {
        // Editing an existing service
        await updateService(selectedService.id, service);
      } else {
        // Adding a new service
        await addService(service as Omit<Service, 'id'>);
      }
      setRefreshList(prev => !prev); // Toggle to trigger list refresh
    } catch (error) {
      console.error("Error saving service: ", error);
    } finally {
      handleDismiss();
    }
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshList(prev => !prev);
    }, [])
  );

  return (
    <View style={styles.container}>
      <ServiceList onEdit={handleEdit} key={refreshList.toString()} />
      <ServiceModal
        visible={modalVisible}
        onDismiss={handleDismiss}
        onSave={handleSave}
        service={selectedService}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAdd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AdminScreen;
