import React, { useState, useEffect } from 'react';
import { FlatList, View, Text } from 'react-native';
import { List, IconButton, ActivityIndicator } from 'react-native-paper';
import { getServices, deleteService } from '../services/firestoreActions';
import { Service } from '../types/interfaces';

interface ServiceListProps {
  onEdit: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ onEdit }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error("Error deleting service: ", error);
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} />;
  }

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <List.Item
          title={item.serviceName}
          description={item.category}
          right={() => (
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="pencil" onPress={() => onEdit(item)} />
              <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
            </View>
          )}
        />
      )}
    />
  );
};

export default ServiceList;
