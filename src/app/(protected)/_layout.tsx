import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ActivityIndicator } from "react-native";
import { Redirect, router, Stack } from "expo-router";
import { AntDesign, MaterialIcons, Entypo } from "@expo/vector-icons";
function AppLayout() {
  const { session, mounting, user } = useAuth();
  if (mounting) return <ActivityIndicator />;
  if (!session) return <Redirect href={"/"} />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="post/[id]"
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: "#FF5700" },
          animation: "slide_from_bottom",
          headerBackButtonDisplayMode: "minimal",
          headerLeft: () => (
            <AntDesign
              name="close"
              size={24}
              color={"white"}
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}

export default AppLayout;
