import TabBar from '@/components/menu/TabBar';
import AuthState from '@/contexts/auth/authState';
import { Tabs } from 'expo-router';
import Toast from 'react-native-toast-message';
import RouterGuard from '../routerPrivate/RouterGuard';


export default function RootLayout() {
  return (
    <AuthState>
      <RouterGuard>
        <Tabs
          initialRouteName="login"
          tabBar={props => <TabBar {...props} hideOnRoutes={['login', 'index', 'RouterGuard', '+not-found', '_sitemap']} />}
          screenOptions={{ headerShown: false }}
        >
          <Tabs.Screen name="login" />
          <Tabs.Screen name="(cell)" options={{ headerShown: false }} />
          <Tabs.Screen name="(user)" options={{ headerShown: false }} />
        </Tabs>
      </RouterGuard>
      <Toast />
    </AuthState>
  );
}
