import TabBar from '@/components/organisms/menu/TabBar';
import AuthState from '@/contexts/auth/authState';
import OptionsState from '@/contexts/options/optionsState';
import PersonState from '@/contexts/person/personState';
import { Tabs } from 'expo-router';
import Toast from 'react-native-toast-message';
import RouterGuard from '../routerPrivate/RouterGuard';


export default function RootLayout() {
  return (
    <AuthState>
      <RouterGuard>
        <PersonState>
          <OptionsState>
            <Tabs
              initialRouteName="index"
              tabBar={props => <TabBar {...props} hideOnRoutes={['login', 'index', 'RouterGuard', '+not-found', '_sitemap']} />}
              screenOptions={{ headerShown: false }}
            >
              <Tabs.Screen name="index" options={{ title: "Login" }} />
              <Tabs.Screen name="(cell)" options={{ headerShown: false }} />
              <Tabs.Screen name="(user)" options={{ headerShown: false }} />
            </Tabs>
          </OptionsState>
        </PersonState>
      </RouterGuard>
      <Toast />
    </AuthState>
  );
}
