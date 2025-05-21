/* components/ModalPicker.tsx */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export interface ModalPickerProps<T extends { id: string | number; name: string; available?: boolean }> {
  options: T[];
  handleCloseModal: () => void;
  selectedItem: (item: T) => void;
}

export function ModalPicker<T extends { id: string | number; name: string; available?: boolean }>({
  options,
  handleCloseModal,
  selectedItem
}: ModalPickerProps<T>) {
  function onPressItem(item: T) {
    if (item.available === false) return;
    selectedItem(item);
    handleCloseModal();
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handleCloseModal}
    >
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map(item => {
            const unavailable = item.available === false;
            return (
              <TouchableOpacity
                key={String(item.id)}
                onPress={() => onPressItem(item)}
                disabled={unavailable}
                style={[
                  styles.option,
                  unavailable && styles.optionUnavailable
                ]}
              >
                <Text
                  style={[
                    styles.item,
                    unavailable && styles.itemUnavailable
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    width: WIDTH - 20,
    height: HEIGHT / 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8a8a8a",
    borderRadius: 4
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 0.8,
    borderTopColor: "#8a8a8a",
    backgroundColor: "#fff"
  },
  optionUnavailable: {
    backgroundColor: "#f8d7da"
  },
  item: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#101026"
  },
  itemUnavailable: {
    color: "#721c24"
  }
});
