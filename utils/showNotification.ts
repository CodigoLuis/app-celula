import Toast from 'react-native-toast-message';

interface NotificationProps {
  messageT?: string;
  messageD?: string;
  duration?: number;
  typeOfNotification?: 'success' | 'error' | 'info';
  positionOfNotification?: 'top' | 'bottom';
}

export const showNotification = ({
  messageT = '',
  messageD = '',
  duration = 4000,
  typeOfNotification = 'success',
  positionOfNotification = 'top'
}: NotificationProps) => {

  Toast.show({
    // --- APARIENCIA Y TIPO ---
    type: typeOfNotification,           // Recibe: 'success', 'error', 'info' o un tipo personalizado.
    position: positionOfNotification,        // Recibe: 'top' o 'bottom'. Define dónde aparece el toast.

    // --- CONTENIDO DE TEXTO ---
    text1: messageT, // Recibe: String. Es el título principal en negrita.
    text2: messageD, // Recibe: String. Es el subtítulo o descripción detallada.

    // --- TIEMPOS Y COMPORTAMIENTO ---
    visibilityTime: duration,      // Recibe: Number (ms). Tiempo que permanece visible (4000 = 4 seg).
    autoHide: true,            // Recibe: Boolean. Si es false, el toast no se irá hasta que el usuario lo toque.

    // --- DISTANCIAS (OFFSET) ---
    topOffset: 50,             // Recibe: Number. Espacio desde el borde superior (si position es 'top').
    bottomOffset: 80,          // Recibe: Number. Espacio desde el borde inferior (si position es 'bottom').

    // --- INTERACCIÓN ---
    // onPress: () => {           // Recibe: Function. Acción que se dispara al tocar el toast.
    //   console.log("Toast presionado");
    // },
    // onShow: () => {            // Recibe: Function. Se ejecuta justo cuando el toast aparece.
    //   console.log("El toast se está mostrando");
    // },
    // onHide: () => {            // Recibe: Function. Se ejecuta cuando el toast desaparece por completo.
    //   console.log("El toast se ha ocultado");
    // },

    // --- DATOS EXTRA ---
    // props: {                   // Recibe: Object. Datos personalizados que puedes pasar si usas un diseño propio (Custom UI).
    //   uuid: '123-abc',
    //   iconName: 'check-circle'
    // }

  });
};
