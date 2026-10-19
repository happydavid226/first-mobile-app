
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [gender, setGender] = useState("");
  const [favoriteFood, setFavoriteFood] = useState("");
  const [file, setFile] = useState<any>(null);

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync();

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  function handleSubmit() {
    const formData = {
      name,
      email,
      password,
      gender,
      favoriteFood,
      accepted,
      file: file
        ? {
            name: file.name,
            uri: file.uri,
            mimeType: file.mimeType,
          }
        : null,
    };

    console.log(formData);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Registration Form
      </Text>

      <Text>Name</Text>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={inputStyle}
      />

      <Text>Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={inputStyle}
      />

      <Text>Password</Text>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={inputStyle}
      />

      <Text>Gender</Text>
      {["Male", "Female", "Prefer not to say"].map((option) => (
        <Pressable
          key={option}
          onPress={() => setGender(option)}
          style={{ marginVertical: 5 }}
        >
          <Text>
            {gender === option ? "🔘" : "⚪"} {option}
          </Text>
        </Pressable>
      ))}

      <Text style={{ marginTop: 15 }}>Favorite Food</Text>
      {["Pizza", "Rice", "Chicken", "Fish", "Other"].map((food) => (
        <Pressable
          key={food}
          onPress={() => setFavoriteFood(food)}
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: favoriteFood === food ? "blue" : "gray",
            marginTop: 5,
          }}
        >
          <Text>{food}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() => setAccepted(!accepted)}
        style={{ marginVertical: 15 }}
      >
        <Text>
          {accepted ? "☑" : "☐"} I accept the terms
        </Text>
      </Pressable>

      <Button title="Choose File" onPress={pickFile} />

      {file && (
        <Text style={{ marginVertical: 10 }}>
          Selected file: {file.name}
        </Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "gray",
  padding: 10,
  marginTop: 5,
  marginBottom: 15,
  borderRadius: 5,
};
