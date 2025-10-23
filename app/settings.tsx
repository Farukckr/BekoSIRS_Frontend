import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<'password' | 'email'>('password');
  const [loading, setLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [passwordForEmail, setPasswordForEmail] = useState('');

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/change-password/', {
        old_password: currentPassword,
        new_password: newPassword,
      });

      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şifre değiştirilemedi';
      Alert.alert('Hata', message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail || !passwordForEmail) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/change-email/', {
        new_email: newEmail,
        password: passwordForEmail,
      });

      Alert.alert('Başarılı', 'E-posta adresiniz başarıyla değiştirildi');
      setNewEmail('');
      setPasswordForEmail('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'E-posta değiştirilemedi';
      Alert.alert('Hata', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Ayarlar" headerColor="#6B7280">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'password' && styles.tabActive]}
            onPress={() => setActiveTab('password')}
          >
            <Text style={[styles.tabText, activeTab === 'password' && styles.tabTextActive]}>
              🔒 Şifre Değiştir
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'email' && styles.tabActive]}
            onPress={() => setActiveTab('email')}
          >
            <Text style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}>
              📧 E-posta Değiştir
            </Text>
          </TouchableOpacity>
        </View>

        {/* Password Change Form */}
        {activeTab === 'password' && (
          <View style={styles.formContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Güvenliğiniz için şifrenizi düzenli olarak değiştirin
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mevcut Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="Mevcut şifreniz"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Yeni Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="Yeni şifreniz (min. 6 karakter)"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
              <TextInput
                style={styles.input}
                placeholder="Yeni şifrenizi tekrar girin"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePasswordChange}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Email Change Form */}
        {activeTab === 'email' && (
          <View style={styles.formContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>📩</Text>
              <Text style={styles.infoText}>E-posta adresinizi güncelleyin</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Yeni E-posta</Text>
              <TextInput
                style={styles.input}
                placeholder="Yeni e-posta adresiniz"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="Mevcut şifreniz"
                value={passwordForEmail}
                onChangeText={setPasswordForEmail}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleEmailChange}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>E-postayı Güncelle</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: '#6B7280',
  },
  tabText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    color: '#4B5563',
    fontSize: 14,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#111827',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#6B7280',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
