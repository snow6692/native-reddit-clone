import React from "react";
import { Pressable, Text } from "react-native";
import { supabase } from "../lib/supabase";

function Logout() {
  const handleSignout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <Pressable onPress={handleSignout}>
      <Text>Logout</Text>
    </Pressable>
  );
}

export default Logout;
