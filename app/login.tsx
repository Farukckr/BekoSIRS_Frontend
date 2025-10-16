import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BekoSIRS'e Hoş Geldiniz</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Giriş Yap" onPress={() => login(username, password)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#1A237E' },
  input: {
    backgroundColor: 'white',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default LoginScreen;