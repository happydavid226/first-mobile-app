import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Switch,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const foods = ["Rice", "Pizza", "Chicken", "Fish", "Other"];
const genders = ["Male", "Female", "Prefer not to say"];

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [gender, setGender] = useState("");
  const [favoriteFood, setFavoriteFood] = useState("");
  const [file, setFile] = useState<any>(null);
  const [cameraImage, setCameraImage] = useState<any>(null);
  const [satisfaction, setSatisfaction] = useState(5);
  const [darkMode, setDarkMode] = useState(false);
  const [aboutMe, setAboutMe] = useState("");

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync();

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  async function takePicture() {
    // Request camera permissions first
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCameraImage(result.assets[0]);
    }
  }

  function handleSubmit() {
    const formData = {
      name,
      email,
      password,
      gender,
      favoriteFood,
      satisfaction,
      darkMode,
      aboutMe,
      accepted,
      file: file
        ? {
            name: file.name,
            uri: file.uri,
            mimeType: file.mimeType,
          }
        : null,
      cameraImage: cameraImage
        ? {
            uri: cameraImage.uri,
            width: cameraImage.width,
            height: cameraImage.height,
          }
        : null,
    };
  
    console.log(formData);
  }

  return (
    <View style={styles.page}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.eyebrow}>GETTING STARTED</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Fill in your details to get started.
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Alex Smith"
              placeholderTextColor="#9299A3"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9299A3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9299A3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Gender</Text>

            <View style={styles.radioGroup}>
              {genders.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setGender(option)}
                  style={styles.choiceRow}
                >
                  <View style={styles.radioOuter}>
                    {gender === option && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.choiceText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Favorite food</Text>

            <View style={styles.foodGroup}>
              {foods.map((food) => (
                <Pressable
                  key={food}
                  onPress={() => setFavoriteFood(food)}
                  style={[
                    styles.foodOption,
                    favoriteFood === food && styles.foodOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.foodText,
                      favoriteFood === food && styles.foodTextSelected,
                    ]}
                  >
                    {food}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Satisfaction range */}
          <View style={styles.section}>
            <View style={styles.rangeHeader}>
              <Text style={styles.label}>How satisfied are you?</Text>
              <Text style={styles.rangeValue}>{satisfaction}/10</Text>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.rangeLabel}>1</Text>

              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={satisfaction}
                onValueChange={setSatisfaction}
                minimumTrackTintColor="#365FCA"
                maximumTrackTintColor="#D9DEE5"
                thumbTintColor="#365FCA"
              />

              <Text style={styles.rangeLabel}>10</Text>
            </View>
                
            <Text style={styles.helperText}>
              Move the slider to select your satisfaction level.
            </Text>
          </View>

          {/* Light and dark mode switch */}
          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View style={styles.switchDescription}>
                <Text style={styles.label}>Appearance</Text>
                <Text style={styles.helperText}>
                  {darkMode ? "Dark mode selected" : "Light mode selected"}
                </Text>
              </View>

              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#D1D5DB", true: "#A5B4FC" }}
                thumbColor={darkMode ? "#365FCA" : "#FFFFFF"}
              />
            </View>
          </View>

          {/* About me multiline text box */}
          <View style={styles.section}>
            <Text style={styles.label}>Tell us something about you</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Share your interests, hobbies, or anything you'd like us to know..."
              placeholderTextColor="#9299A3"
              value={aboutMe}
              onChangeText={setAboutMe}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {aboutMe.length}/500 characters
            </Text>
          </View>

          {/* Camera Capture Option */}
          <View style={styles.section}>
            <Text style={styles.label}>Profile Picture</Text>
            <Pressable style={styles.fileButton} onPress={takePicture}>
              <Text style={styles.fileButtonText}>
                {cameraImage ? "Retake photo" : "📸 Take a picture"}
              </Text>
            </Pressable>

            {cameraImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: cameraImage.uri }} style={styles.previewImage} />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Supporting document</Text>
            <Pressable style={styles.fileButton} onPress={pickFile}>
              <Text style={styles.fileButtonText}>
                {file ? "Choose another file" : "+  Choose a file"}
              </Text>
            </Pressable>

            {file && (
              <Text style={styles.fileName} numberOfLines={2}>
                Selected: {file.name}
              </Text>
            )}
          </View>

          <Pressable
            onPress={() => setAccepted(!accepted)}
            style={styles.termsRow}
          >
            <View
              style={[
                styles.checkbox,
                accepted && styles.checkboxSelected,
              ]}
            >
              {accepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the terms and conditions.
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitPressed,
            ]}
          >
            <Text style={styles.submitText}>Create account</Text>
          </Pressable>

          <Text style={styles.footer}>
            Your details will be collected when you submit.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F3F5F7",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    paddingVertical: 28,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E7E9ED",
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.3,
    color: "#64748B",
    marginBottom: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#202938",
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#687385",
    marginBottom: 25,
  },
  section: {
    marginBottom: 19,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#303A49",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D9DEE5",
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    color: "#202938",
    backgroundColor: "#FFFFFF",
  },
  radioGroup: {
    gap: 12,
  },
  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  radioOuter: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#8993A3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#365FCA",
  },
  choiceText: {
    fontSize: 14,
    color: "#414B5A",
  },
  foodGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  foodOption: {
    borderWidth: 1,
    borderColor: "#D9DEE5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  foodOptionSelected: {
    backgroundColor: "#EDF2FF",
    borderColor: "#365FCA",
  },
  foodText: {
    fontSize: 13,
    color: "#4A5565",
  },
  foodTextSelected: {
    color: "#294DAA",
    fontWeight: "600",
  },
  fileButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D9DEE5",
    borderRadius: 9,
    backgroundColor: "#FAFBFC",
  },
  fileButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#39485D",
  },
  fileName: {
    marginTop: 9,
    fontSize: 12,
    color: "#64748B",
  },
  previewContainer: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9DEE5",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 22,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1.5,
    borderColor: "#A7AFBB",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: "#365FCA",
    borderColor: "#365FCA",
  },
  checkmark: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#566171",
    lineHeight: 19,
  },
  submitButton: {
    backgroundColor: "#3159B8",
    borderRadius: 9,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitPressed: {
    opacity: 0.82,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 11,
    color: "#8992A0",
    lineHeight: 17,
  },
  rangeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rangeValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3159B8",
    backgroundColor: "#EDF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#687385",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  switchDescription: {
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#7A8493",
  },
  textArea: {
    width: "100%",
    minHeight: 125,
    borderWidth: 1,
    borderColor: "#D9DEE5",
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 21,
    color: "#202938",
    backgroundColor: "#FFFFFF",
  },
  characterCount: {
    marginTop: 6,
    fontSize: 11,
    color: "#8992A0",
    textAlign: "right",
  },
});