import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text
} from "react-native";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Gallery permission required!");
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      base64: false,
    });

    if (!picked.canceled) {
      setImage(picked.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!image) return alert("Select an image first!");

    setLoading(true);

    try {
      // Convert selected image to base64
      const base64img = await FileSystem.readAsStringAsync(image, {
        encoding: "base64",
      });

      console.log("Sending to backend, base64 size:", base64img.length);

      const res = await axios.post(
        "https://admirable-stardust-9bea21.netlify.app/.netlify/functions/predict",
        { file: base64img },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Backend Response:", res.data);

      if (res.data.prediction) {
        setResult(JSON.stringify(res.data.prediction, null, 2));
      } else {
        setResult("Unexpected response from backend");
      }
    } catch (error: any) {
      console.log("❌ ERROR:", error.response?.data || error.message);
      setResult("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌿 Plant Disease Detector</Text>

      <Button title="Pick Image" onPress={pickImage} />

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Analyze" onPress={analyzeImage} />

      {loading && <ActivityIndicator size="large" color="green" />}

      {result ? <Text style={styles.result}>{result}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f8f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2f855a",
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginVertical: 20,
  },
  result: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    width: "95%",
  },
});
