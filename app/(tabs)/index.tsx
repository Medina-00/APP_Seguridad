import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Audio } from 'expo-av';

interface Incidencia {
  fecha: string;
  titulo: string;
  descripcion: string;
  foto: string | null;
  audio: string | null;
}

const IndidenciaScreen = () => {
  const [Indidencias, setIndidencias] = useState<Incidencia[]>([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [IndidenciaSeleccionado, setIndidenciaSeleccionado] = useState<Incidencia | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      cargarIndidencias();
    }, [])
  );

  const cargarIndidencias = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const IndidenciasGuardados = await AsyncStorage.multiGet(keys);
      const IndidenciasParseados = IndidenciasGuardados.map(([key, value]) => {
        return value ? JSON.parse(value) : null;
      }).filter(Indidencia => Indidencia !== null);
      setIndidencias(IndidenciasParseados);
    } catch (error) {
      console.error('Error al cargar Indidencias:', error);
    }
  };

  const renderItemIndidencia = ({ item }: { item: Incidencia }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => verDetalleIndidencia(item)}>
      <View style={styles.item}>
        <Text>{item.titulo}</Text>
      </View>
    </TouchableOpacity>
  );

  const verDetalleIndidencia = (Indidencia: Incidencia) => {
    setIndidenciaSeleccionado(Indidencia);
    setMostrarDetalle(true);
  };

  const regresarAIndidencias = async () => {
    setMostrarDetalle(false);
    setIndidenciaSeleccionado(null);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const reproducirAudio = async () => {
    if (IndidenciaSeleccionado?.audio) {
      const { sound } = await Audio.Sound.createAsync({ uri: IndidenciaSeleccionado.audio });
      setSound(sound);
      await sound.playAsync();
    } else {
      Alert.alert('Error', 'No hay audio disponible para esta incidencia.');
    }
  };

  const borrarTodasLasIndidencias = async () => {
    try {
      await AsyncStorage.clear();
      setIndidencias([]);
      Alert.alert('Éxito', 'Todas las incidencias han sido borradas correctamente.');
    } catch (error) {
      console.error('Error al borrar las incidencias:', error);
      Alert.alert('Error', 'Ocurrió un error al intentar borrar las incidencias.');
    }
  };

  return (
    <View style={styles.container}>
      {!mostrarDetalle ? (
          <Text style={styles.text}>Incidencias</Text>
      ) : (
        <View style={styles.detalleIndidencia}>
          {IndidenciaSeleccionado?.foto && <Image source={{ uri: IndidenciaSeleccionado?.foto }} style={styles.image} />}
          <Text style={styles.textD}>Fecha: {IndidenciaSeleccionado?.fecha}</Text>
          <Text style={styles.textD}>Título: {IndidenciaSeleccionado?.titulo}</Text>
          <Text style={styles.textD}>Descripción: {IndidenciaSeleccionado?.descripcion}</Text>
          {IndidenciaSeleccionado?.audio && (
            <TouchableOpacity style={styles.button} onPress={reproducirAudio}>
              <Text style={styles.buttonText}>Reproducir Audio</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={regresarAIndidencias}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      )}
      {!mostrarDetalle && (
        <View>
          <FlatList
            data={Indidencias}
            renderItem={renderItemIndidencia}
            keyExtractor={(item, index) => `${index}`}
          />
          <TouchableOpacity style={styles.button} onPress={borrarTodasLasIndidencias}>
            <Text style={styles.buttonText}>Borrar Incidencias</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80,
    backgroundColor: 'black',
    textAlign:'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  itemContainer: {
    width: '100%',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  detalleIndidencia: {
    width: '1000%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    color: 'white',
  },
  text: {
    fontSize: 25,
    marginBottom: 10,
    color: 'white',
    textAlign:'center',
    fontFamily:'font family'
  },
  Titulo: {
    fontSize: 25,
   
    color: 'white',
    textAlign:'center',
    fontFamily:'font family'
  },
  textD: {
    fontSize: 20,
    marginBottom: 10,
    color: 'white',
    textAlign:'center',
    fontFamily:'font family'
  },
  image: {
    minWidth: 300,
    minHeight: 300,
    marginBottom: 20,
    borderRadius:20,
    borderWidth:2,
    borderColor:'#3498db',
    padding:30
    
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    borderColor:'#3498db',
    borderWidth:2
  },
  buttonText: {
    fontFamily:'font family',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  }
  
});

export default IndidenciaScreen;
