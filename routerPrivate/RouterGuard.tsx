import authContext from '@/contexts/auth/authContext';
import { usePathname, useRouter, useSegments } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

// Array de grupos privados (agrega más aquí si creas nuevos grupos, ej. '(admin)')
const privateGroups = ['(user)', '(cell)'];

const publicRoutes = ['index', 'login', 'register', 'forgot-password'];

const RouterGuard = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, isLoading } = useContext(authContext);
  const router = useRouter();
  const pathname = usePathname();  // Solo para reactividad en useEffect
  const segments = useSegments();  // Solo para validaciones (privada/pública)

  // Función para rutas privadas: Basado SOLO en SEGMENTS (primer segmento es un grupo privado)
  const isPrivateRoute = (): boolean => {
    const firstSegment = segments[0];  // string | undefined
    if (!firstSegment) {
      // console.log(`→ isPrivateRoute: No first segment (raíz), no privada`);
      return false;
    }

    const isGroupPrivate = privateGroups.includes(firstSegment);
    // console.log(`→ isPrivateRoute: Segments=[${segments.join(', ')}], first='${firstSegment}', groupsMatch=${isGroupPrivate}`);
    return isGroupPrivate;  // Ej. first='(cell)' → true; cualquier subpágina dentro es privada
  };

  // Función para rutas públicas: Basado SOLO en SEGMENTS (exactas, subpaths o raíz)
  const isPublicRoute = (): boolean => {
    const firstSegment = segments[0];  // string | undefined

    // Fix para raíz: No firstSegment → 'index' pública
    if (!firstSegment) {
      // console.log(`→ isPublicRoute: Raíz detectada como 'index' pública`);
      return publicRoutes.includes('index');
    }

    // Chequea si firstSegment es una ruta pública exacta o inicio de subpath
    const isPublicStart = publicRoutes.includes(firstSegment);
    const isExactPublic = segments.length === 1 && isPublicStart;  // Ej. ['login'] → true
    const isSubPublic = segments.length > 1 && isPublicStart;  // Ej. ['login', 'reset'] → true (subpath de login)

    const result = isExactPublic || isSubPublic;
    // console.log(`→ isPublicRoute: Segments=[${segments.join(', ')}], first='${firstSegment}', isPublicStart=${isPublicStart}, result=${result}`);
    return result;
  };

  useEffect(() => {
    // Logs para debug (remueve en producción)
    // console.log('=== DEBUG ROUTER GUARD ===');
    // console.log('Raw Pathname:', pathname);
    // console.log('Segments:', segments);
    // console.log('Authenticated:', authenticated);
    // console.log('Is Loading:', isLoading);

    // Si loading o null, no redirigir (muestra loader)
    if (isLoading || authenticated === null) {
      // console.log('→ Saliendo por loading/null');
      return;
    }

    const privateRoute = isPrivateRoute();
    const publicRoute = isPublicRoute();

    // console.log('Final: Is Private?', privateRoute, 'Is Public?', publicRoute);

    // Caso 1: NO autenticado en ruta privada → Redirige a raíz pública
    if (authenticated === false && privateRoute) {
      // console.log('→ Redirigiendo a / (no auth en privada)');
      router.replace('/');
      return;
    }

    // Caso 2: Autenticado en ruta pública → Redirige a home del grupo (ajusta por rol si necesitas)
    if (authenticated === true && publicRoute) {
      // console.log('→ Redirigiendo a /(cell)/home (auth en pública)');
      router.replace('/(cell)/home');  // Cambia a lógica por rol: ej. '/(user)/home2' si userRole === 'user'
      return;
    }

    // Caso 3: Ruta correcta o neutra (no pública ni privada) → No redirigir
    // console.log('→ Ruta OK o neutra, renderizando children');
  }, [authenticated, pathname, router, isLoading]);  // Solo pathname para reactividad (segments se actualiza con él)

  // Loader mientras verifica auth
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
