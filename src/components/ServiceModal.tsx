import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { Service } from '../types/interfaces';

interface ServiceModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (service: Omit<Service, 'id'> | Service) => void;
  service: Omit<Service, 'id'> | Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ visible, onDismiss, onSave, service }) => {
  const [formData, setFormData] = useState<Omit<Service, 'id'> | Service | null>(null);

  useEffect(() => {
    setFormData(service);
  }, [service]);

  const handleChange = (name: string, value: string) => {
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Modal visible={visible} onDismiss={onDismiss} transparent={true}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title={service && 'id' in service ? 'Edit Service' : 'Add Service'} />
          <Card.Content>
            <TextInput
              label="Service Name"
              value={formData?.serviceName || ''}
              onChangeText={(text) => handleChange('serviceName', text)}
              style={styles.input}
            />
            <TextInput
              label="Category"
              value={formData?.category || ''}
              onChangeText={(text) => handleChange('category', text)}
              style={styles.input}
            />
            <TextInput
              label="Estimated Labor Time"
              value={formData?.estimatedLaborTime?.toString() || ''}
              onChangeText={(text) => handleChange('estimatedLaborTime', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Crew Size"
              value={formData?.crewSize?.toString() || ''}
              onChangeText={(text) => handleChange('crewSize', text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Equipment Embedded Costs"
              value={formData?.equipmentEmbeddedCosts?.toString() || ''}
              onChangeText={(text) => handleChange('equipmentEmbeddedCosts', text)}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
          <Card.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button onPress={handleSave}>Save</Button>
          </Card.Actions>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: '90%',
  },
  input: {
    marginBottom: 10,
  },
});

export default ServiceModal;
