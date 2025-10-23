import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import api from '../services/api';
import { saveTokens, clearAllTokens, isAuthenticated } from '../storage/storage.native';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    if (!username || !password) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre zorunludur.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting login...');
      const response = await api.post('/api/token/', {
        username,
        password,
      });

      console.log('✅ Login successful');
      
      // Save tokens
      await saveTokens(response.data.access, response.data.refresh);
      
      Alert.alert('Başarılı', 'Giriş yapıldı!', [
        {
          text: 'Tamam',
          onPress: () => {
            // Navigate to products page
            router.replace('/products');
          },
        },
      ]);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Giriş başarısız.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          errorMessage = 'Kullanıcı adı veya şifre hatalı.';
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.request) {
        // No response from server
        errorMessage = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
      }
      
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    if (!username || !email || !password) {
      Alert.alert('Hata', 'Kullanıcı adı, e-posta ve şifre zorunludur.');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Attempting registration...');
      await api.post('/api/register/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      console.log('✅ Registration successful');
      
      Alert.alert(
        'Başarılı',
        'Kayıt işlemi tamamlandı! Şimdi giriş yapabilirsiniz.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'Kayıt başarısız.';
      
      if (error.response?.data) {
        // Extract specific error messages
        const data = error.response.data;
        if (data.username) {
          errorMessage = `Kullanıcı adı: ${data.username[0]}`;
        } else if (data.email) {
          errorMessage = `E-posta: ${data.email[0]}`;
        } else if (data.password) {
          errorMessage = `Şifre: ${data.password[0]}`;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      } else if (error.request) {
        errorMessage = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
      }
      
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await clearAllTokens();
      Alert.alert('Çıkış Yapıldı', 'Başarıyla çıkış yaptınız.', [
        {
          text: 'Tamam',
          onPress: () => {
            router.replace('/login');
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const checkAuth = async () => {
    return await isAuthenticated();
  };

  return {
    login,
    register,
    logout,
    checkAuth,
    loading,
  };
};