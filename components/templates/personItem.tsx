import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PersonItem = ({ person, onViewDetails }: { person: any, onViewDetails: (id: number) => void }) => {

    // Función para acortar texto
    const truncate = (text: string, limit: number) => {
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    const isBirthdayToday = () => {
        if (!person.birthDate) return false;

        const today = new Date();
        const birthDate = new Date(person.birthDate);

        return today.getDate() === birthDate.getDate() &&
            today.getMonth() === birthDate.getMonth();
    };

    const BirthdayRibbon = () => {
        if (!isBirthdayToday()) return null;
        return (
            <View style={[styles.ribbon, { backgroundColor: isFemale === true ? '#fa8166ff' : '#1f78fdff', }]}>
                <Text style={styles.ribbonText}>🎂 ¡CUMPLEAÑOS!</Text>
            </View>
        );
    };

    const isFemale = person.gender?.toLowerCase() === 'female' || person.gender?.toLowerCase() === 'femenino';

    const GenderSticker = () => {
        return (
            <View>
                <View style={[styles.sticker, { backgroundColor: isFemale ? '#fd79a8' : '#0984e3' }]}>
                    <Text style={styles.stickerText}>{isFemale ? '👩‍💼' : '👨‍💼'}</Text>
                </View>
                {person.isUser || person.user ? <Text style={styles.isUserText}>Usuario</Text> : null}
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={[styles.card, isBirthdayToday() && styles.cardBirthday, isBirthdayToday() && { borderColor: isFemale === true ? '#fab1a0' : '#1f78fdff', }]}
            onPress={() => onViewDetails(person.id)}
        >
            <BirthdayRibbon />
            <GenderSticker />

            <View style={styles.content}>
                <View style={styles.topLine}>
                    <Text style={styles.name}>{truncate(`${person.firstName} ${person.lastName}`, 18)}</Text>
                    <View style={styles.genderBadge}>
                        <Text style={styles.genderText}>{person.gender}</Text>
                    </View>
                </View>

                <View style={styles.bottomLine}>
                    <View style={styles.dataGroup}>
                        <Text style={styles.label}>C.I:</Text>
                        <Text style={styles.value}>{person.idNumber}</Text>
                    </View>
                    <View style={styles.dataGroup}>
                        <Text style={styles.label}>NACIMIENTO:</Text>
                        <Text style={styles.value}>{person.birthDate || 'N/A'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// [
// {
//     "address": "4 Church St", 
//     "birthDate": "2000-04-04", 
//     "createdAt": "2025-12-12T17:24:56.464Z", 
//     "education": { 
//                      "consolidationLevel": "10", 
//                      "id": 1, 
//                      "leaderSchool": true, 
//                      "propheticSchool": true
//      }, 
//     "educationLevel": "High School", 
//     "firstName": "Lisa", 
//     "gender": "Female", 
//     "id": 4, 
//     "idNumber": "V-14.147.147", 
//     "isUser": true, 
//     "lastName": "Disciple", 
//     "maritalStatus": "Single", 
//     "phone": "555-0004", 
//     "photo": "photos/lisa_disciple.jpg", 
//     "updatedAt": null
// }
// ] 

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 7,
        marginVertical: 6,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        overflow: 'hidden', // Importante para que el cintillo no se salga
    },

    cardBirthday: {
        borderWidth: 1,
        backgroundColor: '#fffaf0',
    },
    ribbon: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderBottomLeftRadius: 10,
    },
    ribbonText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '900',
    },

    sticker: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    stickerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    isUserText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#444a4c9d',
        textAlign: 'center',
        marginRight: 15,
        textTransform: 'uppercase',
    },

    content: {
        flex: 1,
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2d3436',
    },
    genderBadge: {
        backgroundColor: '#f1f2f6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    genderText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#636e72',
        textTransform: 'uppercase',
    },
    bottomLine: {
        flexDirection: 'row',
        gap: 15,
    },
    dataGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        color: '#b2bec3',
        fontWeight: '600',
        marginRight: 4,
    },
    value: {
        fontSize: 12,
        color: '#636e72',
    }
});

export default PersonItem;