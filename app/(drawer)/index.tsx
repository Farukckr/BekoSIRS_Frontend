import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import api from '../../services/api';
import { ProductCard } from '../../components/ProductCard';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products/')
      .then(response => setProducts(response.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Ürünler</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  center: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginHorizontal: 20, marginTop: 10, marginBottom: 20 },
  list: { paddingHorizontal: 15 },
});

export default HomeScreen;