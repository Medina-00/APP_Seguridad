import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface Incidencia {
  fecha: string;
  titulo: string;
  descripcion: string;
  foto: string | null;
  audio: string | null;
}

const RegistroIncidenciaScreen = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  const guardarIncidencia = async () => {
    if (!fecha || !titulo || !descripcion) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    const incidencia: Incidencia = { fecha, titulo, descripcion, foto, audio };
    try {
      await AsyncStorage.setItem(`incidencia_${Date.now()}`, JSON.stringify(incidencia));
      setTitulo('');
      setDescripcion('');
      setFecha('');
      setFoto(null);
      setAudio(null);
      Alert.alert('Éxito', 'Incidencia guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la incidencia:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la incidencia.');
    }
  };

  const seleccionarFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar la foto:', error);
      Alert.alert('Error', 'Ocurrió un error al seleccionar la foto.');
    }
  };

  const seleccionarAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: false,
      });
      if (!result.canceled) {
        setAudio(result.assets[0].uri);
        Alert.alert('Éxito', 'Audio seleccionado correctamente.');
      } else {
        console.log('Selección de audio cancelada.');
      }
    } catch (error) {
      console.error('Error al seleccionar el audio:', error);
      Alert.alert('Error', 'Ocurrió un error al seleccionar el audio.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>CREANDO INCIDENCIAS</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
        placeholderTextColor='white'
      />
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        placeholderTextColor='white'
      />
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholderTextColor='white'
      />
      <TouchableOpacity style={styles.button} onPress={seleccionarFoto}>
        <Text style={styles.buttonText}>Seleccionar Foto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={seleccionarAudio}>
        <Text style={styles.buttonText}>Seleccionar Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonGuardar} onPress={guardarIncidencia}>
        <Text style={styles.buttonText}>Guardar Incidencia</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
    fontFamily: 'font family'
  },
  titulo: {
    color: 'white',
    fontSize: 25,
    marginBottom: 30,
    fontFamily: 'font family'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    color: 'white',
    width: '80%',
    fontFamily: 'font family',
    textAlign: 'center'
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonGuardar: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'font family'
  },
});

export default RegistroIncidenciaScreen;
