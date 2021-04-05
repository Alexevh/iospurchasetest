import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';
import IAP from 'react-native-iap';

/* Para poder usar esta version de pruebas en XCODE debemos meter en bundle com.dooboolab.test */
export default function App() {

  /* Estos productos son los que definimos en la appstore, en https://appstoreconnect.apple.com podemos generar los productos */
  const productsIds = ['com.cooni.point1000', 'com.cooni.point1000'];
  
  /* Voy a guardar el usuario */
  const [usuario, setUsuario] = useState({
    name: 'Alex',
    suscription: undefined
  });

  /* los productos que puedo comprar */
  const [products, setProducts] = useState([]);

  useEffect(()=>{

    IAP.getProducts(productsIds).then((res)=>{
      setProducts(res);
    });

    /* Configuro un listener aca */
    const purchaseUpdateSuscription = IAP.purchaseUpdatedListener((purchase)=>{
      const receipt = purchase.transactionReceipt;

      if (receipt){
        //llamamos al backend y hacemos cosas
        console.log(receipt);
        /* finalizamos la transaccion */
        IAP.finishTransaction(purchase);
        /* actualizo el user */
        setUsuario(usuario => ({ ...usuario, suscription: purchase.productId}));
      }
    })

    /* limpio */
    return ()=> {
      purchaseUpdateSuscription.remove();
    }

  },[]);



  return (
    <View style={styles.container}>
      <Text>Prueba de suscripcion a una app en IOS APPStore!</Text>
      <StatusBar style="auto" />
      {
        products.map((producto) =>
        (
          <View>
            <Text>{producto.description}</Text>

              {user.suscription === producto.productId ?
              (
                <Button title='Cancelar'
                onPress={()=> Linking.openURL('google.com')}
                />
              )   :
            <Button title='Comprame' 
              onPress={()=> IAP.requestSubscription(producto.productId)}
            />
          }
          </View>
        ))
      }
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
