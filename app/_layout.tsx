import TabBar from '@/components/organisms/menu/TabBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthState from '@/contexts/auth/authState';
import OptionsState from '@/contexts/options/optionsState';
import PersonState from '@/contexts/person/personState';
import UserState from '@/contexts/user/userState';
import { Tabs } from 'expo-router';
import Toast from 'react-native-toast-message';
import RouterGuard from '../routerPrivate/RouterGuard';

export default function RootLayout() {
  return (
    <AuthState>
      <RouterGuard>
        <PersonState>
          <OptionsState>
            <UserState>
              <SafeAreaProvider>
                <Tabs
                  initialRouteName="index"
                  tabBar={props => <TabBar {...props} hideOnRoutes={['login', 'index', 'RouterGuard', '+not-found', '_sitemap']} />}
                  screenOptions={{ headerShown: false }}
                >
                  <Tabs.Screen name="index" options={{ title: "Login" }} />
                  {/* Define rutas reales para tabs */}
                  <Tabs.Screen name="(cell)/home" options={{ title: "Celula" }} />
                  <Tabs.Screen name="(user)/viewUserDataList" options={{ title: "Usuario" }} />
                  {/* Agrega más si necesitas, ej. (cell)/menu1 */}
                </Tabs>
              </SafeAreaProvider>
            </UserState>
          </OptionsState>
        </PersonState>
      </RouterGuard>
      <Toast />
    </AuthState>
  );
}