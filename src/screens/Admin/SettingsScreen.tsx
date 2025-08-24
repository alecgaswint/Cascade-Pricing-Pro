import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { AppSettings } from '../../types/interfaces';

const SettingsScreen = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'globalConfig');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AppSettings);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (settings) {
      const docRef = doc(db, 'settings', 'globalConfig');
      // Ensure all values are numbers before saving
      const numericSettings = Object.entries(settings).reduce((acc, [key, value]) => {
        acc[key] = Number(value);
        return acc;
      }, {} as { [key: string]: number });

      await setDoc(docRef, numericSettings, { merge: true });
      alert('Settings saved!');
    }
  };

  const handleInputChange = (name: keyof AppSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [name]: value });
    }
  };

  if (loading) {
    return <Title>Loading...</Title>;
  }

  return (
    <View style={styles.container}>
      <Title>Application Settings</Title>
      {settings && Object.keys(settings).map((key) => (
        <TextInput
          key={key}
          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
          value={String(settings[key as keyof AppSettings])}
          onChangeText={(text) => handleInputChange(key as keyof AppSettings, text)}
          keyboardType="numeric"
          style={styles.input}
        />
      ))}
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save Settings
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default SettingsScreen;
