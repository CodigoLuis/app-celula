import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomTabBarProps extends BottomTabBarProps {
  hideOnRoutes?: string[];
}

export default function TabBar({ state, navigation, hideOnRoutes = [] }: CustomTabBarProps) {

  const insets = useSafeAreaInsets();
  
  // Ocultar TabBar si la ruta actual está en la lista de rutas a ocultar
  const currentRoute = state.routes[state.index]?.name;
  if (hideOnRoutes.includes(currentRoute)) {
    return null;
  }

  const contentArray: {}[] = [];

  return (
    <View style={[styles.container, { height: 60 + insets.bottom, paddingBottom: insets.bottom }]} >

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

        // Lógica: Agrupa rutas anidadas por prefijo
        let displayName;
        if (route.name.startsWith("(cell)")) {
          displayName = "Celula";
        } else if (route.name.startsWith("(user)")) {
          displayName = "Usuario";
        } else {
          displayName = null;
        }

        let isTrue: boolean = false;

        if (!displayName) return null;

        for (const element of contentArray) {
          if (element == displayName) isTrue = true;
        }

        if (isTrue === true) return null;
        contentArray.push(displayName)

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>
              {displayName}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // height: 70,
    backgroundColor: '#ffffff',
    elevation: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    color: '#673ab7',
    fontWeight: '600',
  },
  activeIndicator: {
    height: 3,
    width: 24,
    backgroundColor: '#673ab7',
    borderRadius: 2,
    marginTop: 4,
  },
});