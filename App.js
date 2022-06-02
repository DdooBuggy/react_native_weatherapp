import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "f047a860a4ee2cdc7ecf19fd0e744d7d";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState();
  const [cur, setCur] = useState();
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setCur(json.current);
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {days.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator
            color="white"
            style={{ marginTop: 10, flex: 1 }}
            size="large"
          />
        </View>
      ) : (
        <ScrollView style={styles.mainContainer}>
          <View style={styles.current}>
            <Text style={styles.cityName}>{city}</Text>
            <Text style={styles.curTemp}>
              {`${parseFloat(cur.temp).toFixed(1)}°`}
            </Text>
            <Text style={styles.curMain}>{cur.weather[0].main}</Text>
            <Text style={styles.curTempMinMax}>
              Max {`${parseFloat(days[0].temp.max).toFixed(1)}°`} Min{" "}
              {`${parseFloat(days[0].temp.min).toFixed(1)}°`}
            </Text>
          </View>

          <View style={{ marginTop: 40, width: SCREEN_WIDTH, padding: 20 }}>
            <View style={styles.weeks}>
              {days.map((day, index) => (
                <View key={index} style={styles.day}>
                  {index === 0 ? (
                    <Text style={styles.time}>Today</Text>
                  ) : (
                    <Text style={styles.time}>
                      {new Date(day.dt * 1000).toString().substring(0, 3)}
                    </Text>
                  )}
                  <View style={styles.dayInfo}>
                    <Text style={styles.temp}>
                      {`${parseFloat(day.temp.day).toFixed(1)}°`}
                    </Text>
                    <View style={styles.icon}>
                      <Fontisto
                        name={icons[day.weather[0].main]}
                        size={20}
                        color="white"
                      />
                    </View>
                    <Text style={styles.description}>
                      {day.weather[0].description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f1c40f",
  },
  mainContainer: {
    alignItems: "center",
  },
  current: {
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 45,
    fontWeight: "300",
    color: "white",
  },
  curTemp: {
    fontSize: 100,
    fontWeight: "400",
    color: "white",
  },
  curMain: {
    fontSize: 20,
    fontWeight: "200",
    color: "white",
  },
  curTempMinMax: {
    fontSize: 20,
    fontWeight: "200",
    color: "white",
  },
  weeks: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  day: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  time: {
    fontSize: 25,
    color: "white",
    flex: 1,
  },
  dayInfo: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  temp: {
    fontSize: 20,
    color: "white",
    flex: 1.2,
    textAlign: "center",
  },
  icon: {
    flex: 1,
  },
  description: {
    fontSize: 20,
    color: "white",
    flex: 2,
    textAlign: "end",
  },
});
