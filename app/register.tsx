import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, SafeAreaView, Alert } from 'react-native';
import api from '../services/api';
import { router } from 'expo-router';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegister = async () => {
    // Validation
    if (!username || !password || !email) {
      Alert.alert('Hata', 'Kullanıcı adı, e-posta ve şifre alanları zorunludur.');
      return;
    }

    try {
      await api.post('/api/register/', {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      });
      
      Alert.alert('Başarılı', 'Kayıt başarılı! Giriş yapabilirsiniz.');
      router.back();
    } catch (error: any) {
      console.error('Register error:', error?.response?.data || error);
      
      // Better error handling
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error ||
                          'Kayıt başarısız. Bu kullanıcı adı veya e-posta zaten kullanılıyor olabilir.';
      
      Alert.alert('Kayıt Başarısız', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Yeni Hesap Oluştur</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı*"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder="E-posta*"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Şifre*"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />

      <Button title="Kayıt Ol" onPress={handleRegister} />
      
      <Button 
        title="Giriş Ekranına Dön" 
        onPress={() => router.back()} 
        color="#666"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default RegisterScreen;