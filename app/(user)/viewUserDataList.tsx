import InputWithLabel from '@/components/molecules/inputWithLabel';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import optionsContext from '@/contexts/options/optionsContext';
import userContext from '@/contexts/user/userContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';


// Interfaces para estados  second state field
interface FieldState {
  value: string;
  isValid: boolean | null;
}

const ViewUserDataList: React.FC = () => {


  ///////////////////////////////////////////////////

  // // Estados para filtros
  // const [filterText, setFilterText] = useState<string>('');
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  // // Filtra los datos
  // const filteredData = useMemo(() => {
  //   return sampleData.filter(item => {
  //     const matchesText = item.name.toLowerCase().includes(filterText.toLowerCase()) ||
  //                         item.description.toLowerCase().includes(filterText.toLowerCase());
  //     const matchesCategory = !selectedCategory || item.category === selectedCategory;
  //     const matchesStatus = !selectedStatus || item.status === selectedStatus;
  //     return matchesText && matchesCategory && matchesStatus;
  //   });
  // }, [filterText, selectedCategory, selectedStatus]);
  // // Renderiza cada elemento
  // const renderItem: ListRenderItem<Item> = ({ item }) => (
  //   <View style={styles.item}>
  //     <Text style={styles.name}>{item.name}</Text>
  //     <Text style={styles.description}>{item.description}</Text>
  //     <Text style={styles.details}>Categoría: {item.category} | Estado: {item.status}</Text>
  //   </View>
  // );

  ///////////////////////////////////////////////////



  const { getListOfUser, dataListUser } = useContext(userContext);
  const [territorie, setTerritorie] = useState<FieldState>({ value: '', isValid: false });
  const [userType, setUserType] = useState<FieldState>({ value: '', isValid: false });
  const [searchData, setSearchData] = useState<FieldState>({ value: '', isValid: false });


  const { typesUsers, territories, optionsUserType, optionsTerritories } = useContext(optionsContext);

  // Si necesitas cargar datos desde una API, usa useEffect
  useEffect(() => {
    optionsUserType();
    getListOfUser();
    optionsTerritories();
  }, []);

  const filteredData = useMemo(() => {
    return dataListUser.filter(item => {
      const matchesText = item.username.toLowerCase().includes(searchData.value.toLowerCase()) ||
        item.person.firstName.toLowerCase().includes(searchData.value.toLowerCase()) ||
        item.person.lastName.toLowerCase().includes(searchData.value.toLowerCase());
      //  const matchesCategory = !selectedCategory || item.category === selectedCategory;
      //  const matchesStatus = !selectedStatus || item.status === selectedStatus;
      //  return matchesText && matchesCategory && matchesStatus;
      return matchesText;
    });
    //  }, [filterText, selectedCategory, selectedStatus]);
  }, [searchData.value]);

  const setSearch = (value: string) => {
    let newValue = value;

    setSearchData({ value: newValue, isValid: null });
    return;
  };

  const changeTerritorie = (value: string) => {
    setTerritorie({ value, isValid: null });
    return;
  };

  const arrayConstructorTerritories = () => {

    let dataArray: { title: string; id: string }[] = [];

    for (const element of territories.data) {
      const value1 = `${element.name} - ${element.male === true ? "Hombres" : "Mujeres"}`;
      const value2 = element.id;

      dataArray.push({
        "title": value1,
        "id": value2
      })
    }

    return dataArray;
  }

  const changeTypeUser = (value: string) => {
    setUserType({ value, isValid: null });
    return;
  };

  const arrayConstructorTypeUser = () => {

    let dataArray: { title: string; id: string }[] = [];

    for (const element of typesUsers.data) {
      dataArray.push({
        "title": element.title,
        "id": element.id
      })
    }

    return dataArray;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Usuarios Registrados</Text>

      {/* <Text>Filtro</Text> */}

      <View style={styles.shadowedViewContent}>

        <InputWithLabel
          labelText="Buscador "
          value={searchData.value}
          setValue={setSearch}
          styleContainer={{ marginTop: 0, marginBottom: 20 }}
          styleInput={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            height: 33
          }}
          styleLabel={{
            fontSize: 15,
            fontWeight: '600',
            color: '#333',
            marginBottom: 5,
            letterSpacing: 0.2,
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

          {/* territories */}
          <SelectWithLabel
            labelText={'Territorio'}
            theValue={territorie.value}
            setValue={changeTerritorie}
            sample={'Territorio'}
            dataOption={arrayConstructorTerritories()}
            styleContainer={{
              width: '45%',
            }}
            styleLabel={{
              fontSize: 15,
              fontWeight: '600',
              color: '#333',
              marginBottom: 5,
              letterSpacing: 0.2,
            }}
            stylePickerContainer={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              // Sombra sutil 
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 2,
                },
              })
            }}
          />

          {/* Tipo de usuario */}
          <SelectWithLabel
            labelText={'Tipo de usuario'}
            theValue={userType.value}
            setValue={changeTypeUser}
            sample={'Tipo de usuario'}
            dataOption={arrayConstructorTypeUser()}
            styleContainer={{
              width: '45%',
            }}
            styleLabel={{
              fontSize: 15,
              fontWeight: '600',
              color: '#333',
              marginBottom: 5,
              letterSpacing: 0.2,
            }}
            stylePickerContainer={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              // Sombra sutil 
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 2,
                },
              })
            }}
          />
        </View>

      </View>


      <View style={styles.titleContainer}>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>UserName</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Tipo</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Sexo</Text>
        </View>
      </View>

      <ScrollView >

        {dataListUser.length === 0 ? (
          <Text>No hay usuarios registrados.</Text>
        ) : (

          territorie.value !== '' || userType.value !== '' || searchData.value !== '' ?

            filteredData.map((usuario) => (
              <View key={usuario.id} style={styles.usuarioContainer}>
                <View style={styles.fila}>
                  <Text style={styles.valor}>{usuario.username}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.valor}>{usuario.userType.title}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.valor}>{usuario.person.gender}</Text>
                </View>
              </View>
            ))

            :

            dataListUser.map((usuario) => (
              <View key={usuario.id} style={styles.usuarioContainer}>
                <View style={styles.fila}>
                  <Text style={styles.valor}>{usuario.username}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.valor}>{usuario.userType.title}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.valor}>{usuario.person.gender}</Text>
                </View>
              </View>
            ))

        )}

      </ScrollView>
    </View>
  );
};

// Estilos (usa StyleSheet para optimización)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
   titleContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2, // Para Android
    borderBottomWidth:1,
    borderTopWidth:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usuarioContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2, // Para Android
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fila: {
    flexDirection: 'row', // Layout horizontal
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Ocupa espacio proporcional
  },
  valor: {
    fontSize: 11,
    color: '#666',
    flex: 2, // Más espacio para el valor
  },

  shadowedViewContent: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderRadius: 8,
    borderBottomWidth:2,
    marginBottom: 15,

    // Sombras para
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    }),

    // Elevación para Android
    ...(Platform.OS === 'android' && {
      elevation: 8,
    }),
  },

});

export default ViewUserDataList;