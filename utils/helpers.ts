// Constantes de Regex
const NAME_REGEX = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/;
const ID_REGEX = /^(V|E)-\d{1,2}\.\d{3}\.\d{3}$/;
const PHONE_REGEX = /^(?:(?:\+58|0)(?:2\d{2}|412|414|424|416|426)\d{7})$|^(?:\+(?!58)[1-9]\d{0,3}[ -]?(?:\d{1,4}[ -]?){1,3}\d{4,10})$/;
// const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const EDUCATION_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/;


export const validationResponseIdNumber = (value: string):string => {
    const val = value.trim();
    if (!val) return 'La cédula es requerida.';
    if (!ID_REGEX.test(val)) return 'Formato de cédula inválido. Debe ser V-01.123.123 o E-12.123.123.';
    return '';
};

export const validationResponseFirstName = (value: string) => {
    const val = value.trim();
    if (!val) return 'El nombre es requerido.';
    if (val.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (val.length > 30) return 'El nombre no puede exceder los 30 caracteres.';
    if (!NAME_REGEX.test(val)) return 'Cada nombre debe comenzar con mayúscula y no contener números ni símbolos.';
    return '';
};

export const validationResponseLastName = (value: string) => {
    const val = value.trim();
    if (!val) return 'El apellido es requerido.';
    if (val.length < 2) return 'El apellido debe tener al menos 2 caracteres.';
    if (val.length > 40) return 'El apellido no puede exceder los 40 caracteres.';
    if (!NAME_REGEX.test(val)) return 'Cada apellido debe comenzar con mayúscula y no contener números ni símbolos.';
    return '';
};

export const validationResponseEducationLevel = (value: string) => {
    const val = value.trim();
    if (!val) { return 'El nivel educativo es requerido.'; }
    if (val.length < 4) { return 'El nivel educativo debe tener al menos 4 caracteres (ej. "Bachiller").'; }
    if (val.length > 50) { return 'El nivel educativo no puede exceder los 50 caracteres.'; }
    if (!EDUCATION_REGEX.test(val)) { return 'El nivel educativo solo puede contener letras y espacios. No se permiten números ni símbolos.'; }
    return '';
};

export const validationResponsePhone = (value: string) => {
    const val = value.trim();
    if (!val) return 'El teléfono es requerido.';
    if (!PHONE_REGEX.test(val) || !(value.length <= 15)) return 'Formato de teléfono inválido. Use 0412...(04160123456) o formato internacional +...(+584240123456)';
    // El límite de longitud ya lo valida la Regex internamente
    return '';
};

export const validationResponseAddress = (value: string) => {
    const val = value.trim();
    if (val && val.length < 10) return 'La dirección es muy corta (mínimo 10 caracteres).';
    if (val && val.length > 150) return 'La dirección no puede exceder los 150 caracteres.';
    return '';
};

// Helpers para validaciones (llamados en setters)
export const validateIdNumber = (value: string): boolean => {
    // Formato básico Cédula VE: V/E- XX.XXX.XXX (10-11 chars)  education_level
    return Boolean(value.trim() && /^(V|E)-\d{1,2}\.\d{3}\.\d{3}$/.test(value.trim().replace(/\s/g, '')) && value.length >= 10);
};

export const validateFirstName = (value: string): boolean => Boolean(value.trim() && /^(?=.{2,30}$)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(value.trim()));

export const validateLastName = (value: string): boolean => Boolean(value.trim() && /^(?=.{2,40}$)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(value.trim()));

export const validateEducationLevel = (value: string): boolean => Boolean(value.trim() && /^(?=.{4,50}$)[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(value.trim()));

export const validatePhone = (value: string): boolean => Boolean(/^(?:(?:\+58|0)(?:2\d{2}|412|414|424|416|426)\d{7})$|^(?:\+(?!58)[1-9]\d{0,3}[ -]?(?:\d{1,4}[ -]?){1,3}\d{4,10})$/.test(value.trim()) && value.length <= 15);

export const validateAddress = (value: string): boolean => Boolean(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s\.,#\-]{10,150}$/.test(value.trim()));

// No vacío
export const validateBoolean = (value: string): boolean => !!value;


// Función para obtener estilo dinámico del input (borde verde/rojo)
export const getInputStyle = (styles: any, field: { value: string; isValid: boolean | null } | undefined) => {

    if (!field) return [styles, { borderColor: '#ccc' }];

    return [
        styles,//style.input
        {
            borderColor: Boolean(field.value) && !field.isValid ? '#e74c3c' : // ← FIJO: Boolean() coerce a boolean
                field.isValid ? '#4CAF50' : '#ccc', // Verde si válido, gris default
        },
    ];

}
