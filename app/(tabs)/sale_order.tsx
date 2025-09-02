import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, Portal, Dialog, Paragraph } from "react-native-paper";

export default function SalesOrderScreen() {
  const [customer, setCustomer] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleSubmit = () => {
    if (!customer || !item || !qty || !rate) {
      alert("Please fill in all fields.");
      return;
    }

    const rateNum = parseFloat(rate);
    const qtyNum = parseFloat(qty);

    if (isNaN(rateNum) || isNaN(qtyNum)) {
      alert("Quantity and Rate must be numbers");
      return;
    }

    const orderData = {
      customer,
      item,
      qty: qtyNum,
      rate: rateNum,
      total: qtyNum * rateNum,
    };

    console.log("Sales Order Submitted:", orderData);

    // ✅ Show popup dialog
    setDialogVisible(true);

    // Reset form
    setCustomer("");
    setItem("");
    setQty("");
    setRate("");
  };

  const total = qty && rate ? (parseFloat(qty) * parseFloat(rate)).toString() : "0";

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
          <TextInput
            label="Total"
            value={total}
            style={styles.input}
            mode="outlined"
            editable={false}
          />

          <View style={{ marginTop: 20 }}>
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Submit
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* ✅ Popup dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Success</Dialog.Title>
          <Dialog.Content>
            <Paragraph>✅ Order submitted successfully!</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    backgroundColor: "#007AFF",
    elevation: 2,
  },
});
