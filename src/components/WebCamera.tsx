// src/components/WebCamera.tsx
import { useRef, useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

export default function WebCamera({ onCapture, onClose }) {
  // If somehow rendered outside web, bail out
  if (Platform.OS !== "web") return null;
  return <WebCameraInner onCapture={onCapture} onClose={onClose} />;
}

function WebCameraInner({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        if (
          typeof navigator === "undefined" ||
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            "Camera API not available. Make sure you are on https:// or localhost."
          );
        }

        // Try rear camera first, fall back to any camera
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setReady(true);
        }
      } catch (err) {
        setError(err.message || "Unable to access camera.");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // JPEG at 80% quality
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCaptured(dataUrl);
  }

  function handleUsePhoto() {
    if (!captured) return;
    stopStream();
    onCapture(captured);
  }

  function handleRetake() {
    setCaptured(null);
  }

  function handleClose() {
    stopStream();
    onClose();
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>
          {captured ? "Preview" : "Take a picture"}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : captured ? (
          // Captured preview
          <img
            src={captured}
            alt="Captured"
            style={{
              width: "100%",
              maxHeight: 360,
              objectFit: "contain",
              borderRadius: 8,
              background: "#000",
            }}
          />
        ) : (
          // Live camera feed (native <video> — React Native Web renders this fine)
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              maxHeight: 360,
              background: "#000",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        )}

        <View style={styles.row}>
          {captured ? (
            <>
              <Pressable style={styles.buttonGhost} onPress={handleRetake}>
                <Text style={styles.buttonGhostText}>Retake</Text>
              </Pressable>
              <Pressable style={styles.buttonPrimary} onPress={handleUsePhoto}>
                <Text style={styles.buttonPrimaryText}>Use Photo</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={styles.buttonGhost} onPress={handleClose}>
                <Text style={styles.buttonGhostText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonPrimary, !ready && styles.buttonDisabled]}
                onPress={capturePhoto}
                disabled={!ready}
              >
                <Text style={styles.buttonPrimaryText}>
                  {ready ? "📸 Take Photo" : "Starting camera…"}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202938",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  buttonPrimary: {
    backgroundColor: "#3159B8",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
  },
  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonGhost: {
    borderWidth: 1,
    borderColor: "#D9DEE5",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonGhostText: {
    color: "#39485D",
    fontSize: 14,
    fontWeight: "600",
  },
  errorBox: {
    padding: 16,
    backgroundColor: "#FFF1F1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD1D1",
  },
  errorText: {
    color: "#B42318",
    fontSize: 13,
    lineHeight: 19,
  },
});