import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { authZodForm } from "../../validation";
import { supabase } from "../../lib/supabase";
import { Toast } from "react-native-toast-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../providers/AuthProvider";
import { Redirect } from "expo-router";

function Login() {
  const { session } = useAuth();

  if (session) return <Redirect href="home" />;

  const form = useForm<authZodForm>({
    resolver: zodResolver(authZodForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signIn = async (data: authZodForm) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) return alert(error.message);
    Toast.show("Signed in successfully", {
      type: "success",
      placement: "top",
      duration: 1500,
      successColor: "orange",
    });
  };

  const signUp = async (data: authZodForm) => {
    const { error } = await supabase.auth.signUp(data);
    if (error) return alert(error.message);
    Toast.show("Signed up successfully", {
      type: "success",
      placement: "top",
      duration: 1500,
      successColor: "orange",
    });
  };
  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please Authenticate to continue</Text>

        <Controller
          control={form.control}
          name="email"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                editable={!form.formState.isSubmitting}
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                editable={!form.formState.isSubmitting}
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={form.handleSubmit(signIn)}
          disabled={form.formState.isSubmitting}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={form.handleSubmit(signUp)}
          disabled={form.formState.isSubmitting}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default Login;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF5700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 32,
  },
  input: {
    width: "90%",
    padding: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "90%",
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "#FF5700",
    borderColor: "#fff",
    borderWidth: 1,
  },
  signUpButtonText: {
    color: "white",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
});
