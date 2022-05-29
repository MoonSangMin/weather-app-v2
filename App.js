import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import API_KEY from './keys';
const windowWidth = Dimensions.get('window').width;

export default function App() {
  const [city, setCity] = useState("Seoul");
  const [days, setDays] = useState([]);
  const [permission, setPermission] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermission(false);
      }

      const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync({ accuracy: 5 });
			const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
			setCity(location[0].city);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY.API_KEY}&units=metric`);
      const json = await response.json();
      setDays(json.list);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
        <View style={styles.day}>
          <ActivityIndicator color="white" size="large"/>
        </View>
        ) : (
          days.map((day, index) =>
          <View key={index} style={styles.day}>
            <Text style={styles.temp}>{day.main.temp}</Text>
            <Text style={styles.description}>{day.weather[0].description}</Text>
          </View>)
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "coral"
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 45,
  },
  weather: {
    
  },
  day: {
    width: windowWidth,
    alignItems: "center"
  },
  temp: {
    fontSize: 80,
    marginTop: 50,
  },
  description: {
    fontSize: 50
  }
})