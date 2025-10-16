// components/MyProductCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Gelen 'ownership' prop'unun tipini tanımlıyoruz.
// Bu, kodun daha okunaklı ve hatasız olmasını sağlar.
interface OwnershipProps {
  ownership: {
    id: number;
    purchase_date: string;
    warranty_end_date: string;
    product: {
      name: string;
      image_url?: string;
    };
  };
}

export const MyProductCard: React.FC<OwnershipProps> = ({ ownership }) => {
    // Tarih formatlama fonksiyonu
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

  return (
    <View style={styles.card}>
      {ownership.product.image_url && <Image source={{ uri: ownership.product.image_url }} style={styles.image} />}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{ownership.product.name}</Text>
        <Text style={styles.dateText}>Satın Alma: {formatDate(ownership.purchase_date)}</Text>
        <Text style={styles.warranty}>Garanti Bitişi: {formatDate(ownership.warranty_end_date)}</Text>
      </View>
    </View>
  );
};

// Sadece bu component'in ihtiyaç duyduğu stiller
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#eee',
    },
    infoContainer: {
        padding: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: 'gray',
    },
    warranty: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#d32f2f'
    }
});