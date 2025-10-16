import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'expo-router';
import { MyProductCard } from '../../components/MyProductCard';
import api from '../../services/api';

const ProfileScreen = () => {
  const { authToken, login, logout } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (authToken) {
      setLoading(true);
      api.get('/api/my-products/')
        .then(response => setMyProducts(response.data))
        .catch(e => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [authToken]);

  if (authToken) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Satın Aldıklarım</Text>
          <Button title="Çıkış Yap" onPress={logout} color="#ff3b30"/>
        </View>
        {loading ? <ActivityIndicator size="large" /> : (
          <FlatList
            data={myProducts}
            renderItem={({ item }) => <MyProductCard ownership={item} />}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>Henüz satın alınmış bir ürününüz yok.</Text>}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Giriş Yap</Text>
        <TextInput style={styles.input} placeholder="Kullanıcı Adı" value={username} onChangeText={setUsername} autoCapitalize="none"/>
        <TextInput style={styles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry/>
        <Button title="Giriş Yap" onPress={() => login(username, password)} />
        <View style={styles.registerLink}>
            <Text>Hesabınız yok mu? </Text>
            <Link href="/register"><Text style={styles.link}>Kayıt Ol</Text></Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white' },
    title: { fontSize: 28, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
    loginContainer: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { backgroundColor: 'white', height: 50, borderColor: '#ddd', borderWidth: 1, marginBottom: 15, paddingHorizontal: 15, borderRadius: 10 },
    registerLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    link: { color: '#007AFF', fontWeight: 'bold' }
});

export default ProfileScreen;