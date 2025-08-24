import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Modal,
  Portal,
  TextInput,
  Button,
  Card,
  Title,
} from 'react-native-paper';
import { Material } from '../types/interfaces';
import { addMaterial, updateMaterial } from '../services/materialService';

interface MaterialFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: () => void;
  material: Material | null;
}

const MaterialForm = ({
  visible,
  onDismiss,
  onSave,
  material,
}: MaterialFormProps) => {
  const [materialName, setMaterialName] = useState('');
  const [defaultUnitCost, setDefaultUnitCost] = useState('');
  const [defaultMarkupPercent, setDefaultMarkupPercent] = useState('');

  useEffect(() => {
    if (material) {
      setMaterialName(material.materialName);
      setDefaultUnitCost(material.defaultUnitCost.toString());
      setDefaultMarkupPercent(material.defaultMarkupPercent.toString());
    } else {
      setMaterialName('');
      setDefaultUnitCost('');
      setDefaultMarkupPercent('');
    }
  }, [material]);

  const handleSave = async () => {
    const materialData = {
      materialName,
      defaultUnitCost: parseFloat(defaultUnitCost) || 0,
      defaultMarkupPercent: parseFloat(defaultMarkupPercent) || 0,
    };

    try {
      if (material) {
        await updateMaterial(material.id, materialData);
      } else {
        await addMaterial(materialData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Card>
          <Card.Content>
            <Title>{material ? 'Edit Material' : 'Add Material'}</Title>
            <TextInput
              label="Material Name"
              value={materialName}
              onChangeText={setMaterialName}
              style={styles.input}
            />
            <TextInput
              label="Default Unit Cost"
              value={defaultUnitCost}
              onChangeText={setDefaultUnitCost}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Default Markup Percent"
              value={defaultMarkupPercent}
              onChangeText={setDefaultMarkupPercent}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
            <Button onPress={onDismiss} style={styles.button}>
              Cancel
            </Button>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default MaterialForm;
