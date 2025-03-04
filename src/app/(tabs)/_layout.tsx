import { Redirect, Tabs } from "expo-router";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../providers/AuthProvider";
import { ActivityIndicator } from "react-native";

function TabLayout() {
  const { session, mounting, user } = useAuth();
  if (mounting) return <ActivityIndicator />;
  if (!session) return <Redirect href={"/auth"} />;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF5700",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Reddit",
          headerTintColor: "#FF5700",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: "Communities",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",

          tabBarIcon: ({ color }) => (
            <Ionicons name="create" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <AntDesign name="message1" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => (
            <AntDesign name="inbox" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
