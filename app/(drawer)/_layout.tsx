import { Drawer } from 'expo-router/drawer';
import { FontAwesome } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Ana Sayfa',
          title: 'BekoSIRS Ürünler',
          drawerIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profilim & Giriş',
          title: 'Profilim',
          drawerIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}