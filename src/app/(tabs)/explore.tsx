import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export default function ExploreScreen() {
  return (
    <View>
      <ThemedText>Explore Screen</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
