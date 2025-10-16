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
        if (!username || !password || !email) {
            Alert.alert('Hata', 'Kullanıcı adı, e-posta ve şifre alanları zorunludur.');
            return;
        }
        try {
            await api.post('/api/register/', {
                username, password, email,
                first_name: firstName, last_name: lastName,
            });
            Alert.alert('Başarılı', 'Kaydınız oluşturuldu! Profil sayfasından giriş yapabilirsiniz.');
            router.back();
        } catch (error) {
            console.error(error.response?.data);
            Alert.alert('Kayıt Başarısız', 'Bu kullanıcı adı veya e-posta zaten kullanılıyor olabilir.');
        }
    };

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Yeni Hesap Oluştur</Text>
        <TextInput style={styles.input} placeholder="Kullanıcı Adı*" value={username} onChangeText={setUsername} autoCapitalize='none' />
        <TextInput style={styles.input} placeholder="E-posta*" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize='none' />
        <TextInput style={styles.input} placeholder="İsim" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Soyisim" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Şifre*" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Hesap Oluştur" onPress={handleRegister} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { backgroundColor: 'white', height: 50, borderColor: '#ddd', borderWidth: 1, marginBottom: 12, paddingHorizontal: 15, borderRadius: 10 },
});

export default RegisterScreen;