// src/Content.js
/* --------------------------------------------------------------
   Todo List – single‑file React Native implementation
   --------------------------------------------------------------
   • All UI, state, handlers live in this file.
   • Designed for a clean, premium look while staying compact.
   -------------------------------------------------------------- */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Alert,
  Platform,
} from "react-native";

/* --------------------------- Types --------------------------- */
// Using plain JavaScript, no TypeScript types needed.

/* -------------------------- Component ------------------------ */
export default function Content() {
  /* -------------------------- State -------------------------- */
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [inputText, setInputText] = useState("");

  /* -------------------------- Handlers ----------------------- */
  const addTodo = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newTodo = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos(prev => [newTodo, ...prev]);
    setInputText("");
    Keyboard.dismiss();
  }, [inputText]);

  const toggleTodo = useCallback(id => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback(id => {
    Alert.alert("Delete", "Remove this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTodos(prev => prev.filter(t => t.id !== id)),
      },
    ]);
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter(t => !t.completed);
      case "completed":
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  /* -------------------------- Render -------------------------- */
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.checkbox}>
        <Text style={styles.icon}>{item.completed ? "☑" : "☐"}</Text>
      </TouchableOpacity>

      <Text
        style={[styles.itemText, item.completed && styles.itemTextCompleted]}
      >
        {item.text}
      </Text>

      <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.trashBtn}>
        <Text style={styles.icon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>No tasks yet</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Todo List</Text>
        <View style={styles.filterBar}>
          {(["all", "active", "completed"]).map(key => (
            <TouchableOpacity
              key={key}
              onPress={() => setFilter(key)}
              style={[styles.filterBtn, filter === key && styles.filterBtnActive]}
            >
              <Text
                style={[styles.filterText, filter === key && styles.filterTextActive]}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          placeholder="What needs to be done?"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
          style={styles.textInput}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addTodo} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos.sort((a, b) => b.createdAt - a.createdAt)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmptyComponent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

/* --------------------------- Styles -------------------------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#1976d2",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filterBtnActive: {
    backgroundColor: "#fff",
  },
  filterText: {
    color: "#e3f2fd",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#1976d2",
    fontWeight: "600",
  },

  inputArea: {
    flexDirection: "row",
    margin: 20,
    marginBottom: 0,
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#212121",
  },
  addBtn: {
    backgroundColor: "#1976d2",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 56,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  checkbox: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#757575",
  },
  trashBtn: {
    padding: 6,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    color: "#bbb",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    color: "#777",
  },
});
