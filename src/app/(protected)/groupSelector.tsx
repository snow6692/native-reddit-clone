import {
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import groups from "../../../assets/data/groups.json";
import { useState } from "react";
function GroupSelector() {
  const [searchValue, setSearchValue] = useState("");
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <SafeAreaView style={{ marginHorizontal: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <AntDesign
          name="close"
          size={30}
          color={"black"}
          onPress={() => router.back()}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
            paddingRight: 30,
          }}
        >
          Post to
        </Text>
      </View>

      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "lightgray",
          borderRadius: 5,
          gap: 5,
          marginVertical: 10,

          paddingHorizontal: 15,
        }}
      >
        <AntDesign name="search1" size={16} color={"gray"} />
        <TextInput
          placeholder="Search for a community"
          placeholderTextColor={"gray"}
          style={{ paddingVertical: 10 }}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
      </View>
      <FlatList
        data={filteredGroups}
        renderItem={({ item }) => (
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginBottom: 20,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
            />
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

export default GroupSelector;
