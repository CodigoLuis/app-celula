import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomTabBarProps extends BottomTabBarProps {
  hideOnRoutes?: string[];
}

export default function TabBar({ state, navigation, hideOnRoutes = [] }: CustomTabBarProps) {
  // Ocultar TabBar si la ruta actual está en la lista de rutas a ocultar
  const currentRoute = state.routes[state.index]?.name;
  if (hideOnRoutes.includes(currentRoute)) {
    return null;
  }

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Filtrar y mostrar solo los nombres de las páginas principales
        let displayName;
        if (route.name == "(cell)") {
          displayName = "Celula";
        } else if (route.name == "(user)") {
          displayName = "Usuario";
        } else {
          displayName = null;
        }

        if (!displayName) return null;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}  // Efecto de opacidad al tocar para feedback táctil
          >
            <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>
              {displayName}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}  {/* Underline sutil para el activo */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,  // Un poco más alto para un look más moderno
    backgroundColor: '#ffffff',  // Blanco puro
    borderTopWidth: 0,  // Quité el borde para un diseño más limpio
    // Sombras suaves y modernas (compatible con iOS y Android)
    elevation: 12,  // Android: sombra más pronunciada pero suave
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,  // Más espacio vertical para comodidad
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontSize: 13,  // Tamaño un poco más grande para legibilidad moderna
    color: '#8E8E93',  // Gris suave y moderno (como en apps iOS)
    fontWeight: '500',  // Peso medio para un look equilibrado
    textAlign: 'center',
    letterSpacing: 0.2,  // Espaciado sutil entre letras
  },
  activeTabLabel: {
    color: '#673ab7',  // Púrpura vibrante para activo
    fontWeight: '600',  // Un poco más bold para énfasis
  },
  activeIndicator: {
    height: 3,  // Underline delgado
    width: 24,  // Ancho centrado
    backgroundColor: '#673ab7',  // Mismo color que el texto activo
    borderRadius: 2,  // Bordes redondeados para modernidad
    marginTop: 4,  // Espacio entre texto y underline
  },
});