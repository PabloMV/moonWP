import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { PermissionsAndroid } from "react-native";
import * as Notifications from "expo-notifications";
//import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

export default function App() {
  //requestLocationPermission();
  /*   const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "MoonWP needs access to your location " +
            "so you can see the weather around you.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }; */
  const [location, setLocation, getAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location, "appJS");
        console.log(location);
        let getAddress = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setTimeout(() => {
          const myScript = `
        setTimeout(()=> {
          //window.localStorage.setItem("address", "${getAddress[0].city}");
          //window.localStorage.setItem("latitude", "${location.coords.latitude}");
          //window.localStorage.setItem("longitude", "${location.coords.longitude}");
          //window.localStorage.setItem("country", "${getAddress[0].country}");
          //window.localStorage.setItem("region", "${getAddress[0].region}");
          window.localStorage.setItem("postalCode", "${getAddress[0].postalCode}");
          window.localStorage.setItem("number", "${getAddress[0].name}");
          window.localStorage.setItem("street", "${getAddress[0].street}");   
          window.localStorage.setItem("userName", "${getAddress[0].city}");     
         
         
          
         if(window.localStorage.getItem('userName')) {
            //do login
            var userName = window.localStorage.getItem('userName');
            function getPrevPostId(id){   
              jQuery.post( 'https://moonm.raicom.online', {           
                  action: "auto_login",      
                  id: id                  
                }, function(res) { 
                 window.alert(res)
                });
            }
            getPrevPostId(userName);
           
          }else{
            window.alert("Please login first");
          }
          document.body.innerText=JSON.stringify(window.localStorage);
          //window.localStorage.setItem('test', 'test');
          window.alert(window.localStorage.getItem('street'));
          
        }, 1000);
        true; // note: this is required, or you'll sometimes get silent failures
      `
          console.log(myScript);
          webViewRef.current.injectJavaScript(myScript);
        }, 3000);
        console.log(getAddress, "appJS");
      }
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log(token);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  async function registerForPushNotificationsAsync() {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  const webViewRef = useRef();

  return (
    <WebView
      style={styles.container}
      source={{ uri: "https://moon.raicom.online/" }}
      geolocationEnabled={true}
      onMessage={(event) => {
        Alert.alert(event.nativeEvent.data);
      }}
     
      ref={webViewRef}
      originWhitelist={["https://*"]}
      //injectedJavaScript={myScript}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
