import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
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
      const settingsToSave = Object.fromEntries(
        Object.entries(settings).map(([key, value]) => [key, Number(value)])
      );
      await setDoc(docRef, settingsToSave, { merge: true });
      alert('Settings saved successfully!');
    }
  };

  const handleChange = (name: keyof AppSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [name]: value });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {settings &&
        Object.keys(settings).map((key) => (
          <TextInput
            key={key}
            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            value={String(settings[key as keyof AppSettings])}
            onChangeText={(text) => handleChange(key as keyof AppSettings, text)}
            keyboardType="numeric"
            style={styles.input}
          />
        ))}
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save
      </Button>
    </ScrollView>
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
