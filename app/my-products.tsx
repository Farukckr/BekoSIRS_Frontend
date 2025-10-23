import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import MyProductCard from '../components/MyProductCard';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
  category: {
    id: number;
    name: string;
  } | null;
  status: string;
  description: string;
  assigned_date?: string;
}

export default function MyProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      console.log('📦 Fetching my products...');
      const response = await api.get('/api/my-products/');
      console.log('✅ My products loaded:', response.data.length);
      setProducts(response.data);
    } catch (error: any) {
      console.error('❌ Error fetching my products:', error.message);
      
      if (error.response?.status === 404) {
        Alert.alert('Bilgi', 'Henüz size atanmış ürün bulunmuyor.');
      } else if (error.code === 'ECONNABORTED' || error.message.includes('Network')) {
        Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanılamadı. Lütfen internetinizi kontrol edin.');
      } else {
        Alert.alert('Hata', 'Ürünler yüklenirken beklenmeyen bir hata oluştu.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyProducts();
  };

  if (loading) {
    return (
      <AppLayout title="Ürünlerim" headerColor="#8B5CF6">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Ürünleriniz yükleniyor...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Ürünlerim" headerColor="#8B5CF6">
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={({ item }) => <MyProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#8B5CF6']}
            />
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerInfo}>
              <Text style={styles.infoIcon}>🎁</Text>
              <Text style={styles.infoTitle}>Size Özel Ürünler</Text>
              <Text style={styles.infoText}>
                Size atanan {products.length} ürün bulunuyor
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>Henüz ürün yok</Text>
          <Text style={styles.emptyText}>
            Size atanmış ürün bulunmuyor.{'\n'}
            Yöneticiniz size ürün atadığında burada görüntüleyebileceksiniz.
          </Text>
        </View>
      )}
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  headerInfo: {
    backgroundColor: '#F3E8FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#8B5CF6',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
