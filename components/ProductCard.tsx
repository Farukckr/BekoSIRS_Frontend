// components/ProductCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Gelen 'product' prop'unun tipini daha net belirtmek iyi bir pratiktir.
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    brand: string;
    price: string;
    image_url?: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <View style={styles.card}>
      {product.image_url && <Image source={{ uri: product.image_url }} style={styles.image} />}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.price}>{parseFloat(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
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
        marginBottom: 4,
    },
    brand: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A237E',
        textAlign: 'right',
    },
});