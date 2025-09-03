import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Dialog, Paragraph, Portal, Text, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker"; // dropdown picker

export default function SalesOrderScreen() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const ERP_URL = "http://10.0.2.2:8000/api/resource";
  const ERP_HEADERS = {
    "Content-Type": "application/json",
    Authorization: "token d59aee6dda93b1d:9a4cc3ac4498ca2",
  };

  // 🔹 Fetch Customers & Items once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await axios.get(
          `${ERP_URL}/Customer?fields=["name","customer_name"]&limit=50`,
          { headers: ERP_HEADERS }
        );
        setCustomers(custRes.data.data);

        const itemRes = await axios.get(
          `${ERP_URL}/Item?fields=["name","item_name","standard_rate"]&limit=50`,
          { headers: ERP_HEADERS }
        );
        setItems(itemRes.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Submit Sales Order
  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedItem || !quantity || !rate) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        `${ERP_URL}/Sales Order`,
        {
          customer: selectedCustomer,
          transaction_date: new Date().toISOString().split("T")[0],
          delivery_date: new Date().toISOString().split("T")[0],
          items: [
            {
              item_code: selectedItem,
              qty: parseFloat(quantity),
              rate: parseFloat(rate),
            },
          ],
        },
        { headers: ERP_HEADERS }
      );

      setDialogMessage("✅ Sales Order submitted successfully!");
      setDialogVisible(true);

      setSelectedCustomer("");
      setSelectedItem("");
      setQuantity("");
      setRate("");
    } catch (err: any) {
      setDialogMessage(`❌ Failed:\n${JSON.stringify(err.response?.data || err.message)}`);
      setDialogVisible(true);
      console.error(err);
    }
  };

  const total = quantity && rate ? (parseFloat(quantity) * parseFloat(rate)).toString() : "0";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Customer Dropdown */}
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(val:string) => setSelectedCustomer(val)}
            style={styles.input}
          >
            <Picker.Item label="-- Select Customer --" value="" />
            {customers.map((c) => (
              <Picker.Item key={c.name} label={c.customer_name} value={c.name} />
            ))}
          </Picker>

          {/* Item Dropdown */}
          <Picker
            selectedValue={selectedItem}
            onValueChange={(val:string) => {
              setSelectedItem(val);
              const itemObj = items.find((i) => i.name === val);
              if (itemObj) setRate(itemObj.standard_rate?.toString() || "0");
            }}
            style={styles.input}
          >
            <Picker.Item label="-- Select Item --" value="" />
            {items.map((i) => (
              <Picker.Item key={i.name} label={i.item_name} value={i.name} />
            ))}
          </Picker>

          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
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
              Submit Order
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Result</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogMessage}</Paragraph>
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
  container: { flexGrow: 1, padding: 20, paddingTop: 50, backgroundColor: "#f8f9fa" },
  card: { borderRadius: 12, elevation: 3, backgroundColor: "#fff", paddingVertical: 10 },
  input: { marginBottom: 15 },
  button: { borderRadius: 8, backgroundColor: "#007AFF", elevation: 2 },
});
