import React from 'react'
import { View,StyleSheet,Image,Text } from 'react-native'

function AcercaDe() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/fotoPerfil.jpg')}
        style={styles.photo}
      />
      
      <Text style={styles.contactInfo}>
        Nombre: Luis Angel Morel Medina
        {'\n'}
        {'\n'}
        Matricula: 2022-1063
        {'\n'}
        {'\n'}
        La seguridad es el fruto del trabajo conjunto, donde cada eslabón de vigilancia y servicio fortalece el escudo de la comunidad.
      </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'black',
    color:'white'
  },
  photo: {
    width: 250,
    height: 300,
    borderRadius: 75,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color:'white',
    fontFamily: 'Times New Roman'
  },
  contactInfo: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color:'white',
    fontFamily: 'Times New Roman',
  },
});


export default AcercaDe
