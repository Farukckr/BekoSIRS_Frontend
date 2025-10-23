import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';   // 👈 Href eklendi
import { useAuth } from '../hooks/useAuth';
import { getToken } from '../storage/storage.native';

interface SidebarProps {
  onClose: () => void;
}

type MenuItem = {
  icon: string;
  label: string;
  route: Href;     // 👈 route tipi düzeltildi
  color: string;
};

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = await getToken();
      if (token) {
        setUserInfo({
          name: 'Kullanıcı',
          email: 'user@beko.com',
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const menuItems: MenuItem[] = [
    { icon: '🏠', label: 'Ana Sayfa', route: '/products' as Href, color: '#3B82F6' },
    { icon: '📦', label: 'Ürünlerim', route: '/my-products' as Href, color: '#8B5CF6' },
    { icon: '⚙️', label: 'Ayarlar', route: '/settings' as Href, color: '#6B7280' },
  ];

  const handleNavigation = (route: Href) => {
    onClose();
    router.push(route);   // ✅ Artık tip uyuşmazlığı olmaz
  };

  const handleCustomerService = () => {
    Alert.alert(
      '🎧 Müşteri Hizmetleri',
      'Nasıl yardımcı olabiliriz?',
      [
        {
          text: '📧 E-posta Gönder',
          onPress: () => {
            Linking.openURL('mailto:destek@beko.com?subject=Destek Talebi');
          },
        },
        {
          text: '📞 Ara',
          onPress: () => {
            Linking.openURL('tel:08502589898');
          },
        },
        {
          text: 'İptal',
          style: 'cancel',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış',
        style: 'destructive',
        onPress: async () => {
          onClose();
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>BEKO</Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userInfo?.name?.charAt(0).toUpperCase() || 'K'}
              </Text>
            </View>
            <Text style={styles.userName}>{userInfo?.name || 'Kullanıcı'}</Text>
            <Text style={styles.userEmail}>{userInfo?.email || ''}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Customer Service */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destek</Text>
          <TouchableOpacity
            style={styles.customerServiceCard}
            onPress={handleCustomerService}
            activeOpacity={0.8}
          >
            <View style={styles.csIconContainer}>
              <Text style={styles.csIcon}>🎧</Text>
            </View>
            <View style={styles.csContent}>
              <Text style={styles.csTitle}>Müşteri Hizmetleri</Text>
              <Text style={styles.csSubtitle}>7/24 Destek</Text>
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>📞</Text>
                  <Text style={styles.contactText}>0850 258 98 98</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>📧</Text>
                  <Text style={styles.contactText}>destek@beko.com</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Beko v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 Tüm hakları saklıdır</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  logoText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  userInfo: { alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#6B7280' },
  menuContainer: { padding: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuIcon: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
  menuArrow: { fontSize: 24, color: '#9CA3AF' },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  customerServiceCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  csIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  csIcon: { fontSize: 28 },
  csContent: { flex: 1 },
  csTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  csSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  contactInfo: { gap: 6 },
  contactItem: { flexDirection: 'row', alignItems: 'center' },
  contactIcon: { fontSize: 14, marginRight: 8 },
  contactText: { fontSize: 14, color: '#FFF', fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutIcon: { fontSize: 20, marginRight: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#DC2626' },
  footer: { padding: 24, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
});

export default Sidebar;
