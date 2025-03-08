import {
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { useSelectGroup } from "../../store/communities";
import { Group } from "../../supabase.types";
import { useGetGroups } from "../../api/groups";
function GroupSelector() {
  const [searchValue, setSearchValue] = useState("");
  const { group, setGroup } = useSelectGroup();
  const { data: groups, error, isLoading } = useGetGroups(searchValue);

  const onGroupSelected = (item: Group) => {
    setGroup(item);
    router.back();
  };
  if (isLoading) return <ActivityIndicator />;

  if (error || !groups) return <Text>Error fetching groups</Text>;

  // const filteredGroups = groups.filter((group) =>
  //   group.name.toLowerCase().includes(searchValue.toLowerCase())
  // );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}
    >
      <SafeAreaView style={{ marginHorizontal: 10, flex: 1 }}>
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
            style={{ paddingVertical: 10, flex: 1 }}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
          />
          {searchValue && (
            <AntDesign
              name="closecircle"
              color={"red"}
              onPress={() => setSearchValue("")}
              size={20}
            />
          )}
        </View>
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onGroupSelected(item)}
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
    </KeyboardAvoidingView>
  );
}

export default GroupSelector;
