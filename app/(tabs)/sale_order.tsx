import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";

export default function SalesOrderScreen() {
  const [customer, setCustomer] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");

  const handleSubmit = () => {
    if (!customer || !item || !qty || !rate) {
      alert("Please fill in all fields.");
      return;
    }
    const orderData = { customer, item, qty, rate };
    console.log("Sales Order Submitted:", orderData);
    alert("✅ Sales Order Created Successfully!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        📝 Create Sales Order
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Customer Name"
            value={customer}
            onChangeText={setCustomer}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Item"
            value={item}
            onChangeText={setItem}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Quantity"
            value={qty}
            onChangeText={setQty}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Rate"
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <View style={{ marginTop: 20 }}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              contentStyle={{ paddingVertical: 6 }}
            >
              Submit Order
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f8f9fa",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#222",
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#007AFF", // iOS blue
    elevation: 2,
  },
});
