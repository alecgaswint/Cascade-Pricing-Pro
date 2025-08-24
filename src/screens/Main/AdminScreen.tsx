import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const AdminScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Management</List.Subheader>
        <List.Item
          title="Manage Materials"
          left={() => <List.Icon icon="hammer-wrench" />}
          onPress={() => navigation.navigate('Materials')}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AdminScreen;
