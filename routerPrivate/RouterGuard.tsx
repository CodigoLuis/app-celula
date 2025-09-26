import authContext from '@/contexts/auth/authContext';
import { usePathname, useRouter, useSegments } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const publicRoutes = ['login', 'register', 'forgot-password'];  // ← CAMBIO: Sin leading slash para normalización
const privateGroups = ['(user)', '(cell)'];

const RouterGuard = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, isLoading } = useContext(authContext);
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();  // Ej. '/login' o 'login'

  // ← NUEVO: Función para normalizar path (remueve leading slash y trailing slash)
  const normalizePath = (path: string | null): string => {
    if (!path) return '';
    return path.replace(/^\/+/, '').replace(/\/+$/, '');  // Ej. '/login/' → 'login', 'login' → 'login'
  };

  const normalizedPathname = normalizePath(pathname);  // Ej. 'login'
  const normalizedSegments = segments.join('/').replace(/^\/+/, '');  // Fallback si no usas pathname

  // Función mejorada para rutas privadas
  const isPrivateRoute = () => {
    const normPath = normalizedPathname;
    const isGroupPrivate = privateGroups.some(group => normPath.startsWith(group));  // Ej. 'cell/home' startsWith '(cell)'
    const isPathPrivate = normPath.startsWith('user/') || normPath.startsWith('cell/');  // Flat paths
    const result = isGroupPrivate || isPathPrivate;
    console.log(`→ isPrivateRoute: normPath='${normPath}', groupsMatch=${isGroupPrivate}, pathMatch=${isPathPrivate}, result=${result}`);
    return result;
  };

  // Función mejorada para rutas públicas (más flexible)
  const isPublicRoute = () => {
    const normPath = normalizedPathname;
    const matches = publicRoutes.some(route => 
      normPath === route ||  // Exacto: 'login' === 'login'
      normPath.startsWith(route + '/') ||  // Subpath: 'login/reset' startsWith 'login/'
      normPath.includes(route)  // Fallback para casos raros (ej. '(auth)/login' includes 'login')
    );
    console.log(`→ isPublicRoute: normPath='${normPath}', matches=[${publicRoutes.map(r => normPath.includes(r)).join(', ')}], result=${matches}`);
    return matches;
  };

  useEffect(() => {
    // Logs detallados para debug (quita después de fix)
    console.log('=== DEBUG ROUTER GUARD ===');
    console.log('Raw Pathname:', pathname);  // Valor crudo de usePathname
    console.log('Normalized Pathname:', normalizedPathname);  // Después de normalizar
    console.log('Segments:', segments);  // Array
    console.log('Normalized Segments:', normalizedSegments);
    console.log('Authenticated:', authenticated);
    console.log('Is Loading:', isLoading);

    // Si loading o null, no redirigir
    if (isLoading || authenticated === null) {
      console.log('→ Saliendo por loading/null');
      return;
    }

    const privateRoute = isPrivateRoute();
    const publicRoute = isPublicRoute();

    console.log('Final: Is Private?', privateRoute, 'Is Public?', publicRoute);

    // Caso 1: NO autenticado en ruta privada → A login
    if (authenticated === false && privateRoute) {
      console.log('→ Redirigiendo a /login (no auth en privada)');
      router.replace('/login');
      return;
    }

    // Caso 2: Autenticado en ruta pública → A home (¡TU ISSUE!)
    if (authenticated === true && publicRoute) {
      console.log('→ Redirigiendo a /(cell)/home (auth en pública) - ¡FIX!');
      router.replace('/(cell)/home');
      return;
    }

    // Caso 3: Ruta correcta o neutra → No redirigir
    console.log('→ Ruta OK o neutra, renderizando children');
  }, [authenticated, pathname, segments, router, isLoading]);  // pathname y segments para reactividad

  // Loader
  if (isLoading || authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Verificando sesión...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default RouterGuard;