import axios from "axios";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Dialog, Paragraph, Portal, Text, TextInput } from "react-native-paper";

export default function SalesOrderScreen() {
    const [customer, setCustomer] = useState("");
    const [item, setItem] = useState("");
    const [quantity, setQuantity] = useState("");
    const [rate, setRate] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const ERP_URL = "http://10.0.2.2:8000/api/resource";
    const ERP_HEADERS = {
        "Content-Type": "application/json",
        Authorization: "token d59aee6dda93b1d:9a4cc3ac4498ca2", // replace with your token
    };

    // 🔹 Ensure Customer exists (auto-create if not)
    const ensureCustomerExists = async (customerName: string) => {
        try {
            const existing = await axios.get(
                `${ERP_URL}/Customer?filters=[["customer_name","=","${customerName}"]]`,
                { headers: ERP_HEADERS }
            );

            if (existing.data.data.length > 0) {
                return existing.data.data[0].name; // existing customer_id
            }

            const newCustomer = await axios.post(
                `${ERP_URL}/Customer`,
                {
                    customer_name: customerName,
                    customer_group: "All Customer Groups",
                    territory: "All Territories",
                },
                { headers: ERP_HEADERS }
            );

            return newCustomer.data.data.name;
        } catch (err: any) {
            throw new Error(`Customer check/create failed: ${JSON.stringify(err.response?.data || err.message)}`);
        }
    };

    // 🔹 Ensure Item exists (auto-create if not)
    const ensureItemExists = async (itemCode: string, rateNum: number) => {
        try {
            const existing = await axios.get(
                `${ERP_URL}/Item?filters=[["item_code","=","${itemCode}"]]`,
                { headers: ERP_HEADERS }
            );

            if (existing.data.data.length > 0) {
                return existing.data.data[0].name; // existing item_code
            }

            const newItem = await axios.post(
                `${ERP_URL}/Item`,
                {
                    item_code: itemCode,
                    item_name: itemCode,
                    item_group: "All Item Groups",
                    stock_uom: "Nos",
                    standard_rate: rateNum,
                },
                { headers: ERP_HEADERS }
            );

            return newItem.data.data.name;
        } catch (err: any) {
            throw new Error(`Item check/create failed: ${JSON.stringify(err.response?.data || err.message)}`);
        }
    };

    // 🔹 Handle Sales Order Submission
    const handleSubmit = async () => {
        if (!customer || !item || !quantity || !rate) {
            alert("Please fill in all fields.");
            return;
        }

        const qtyNum = parseFloat(quantity);
        const rateNum = parseFloat(rate);

        if (isNaN(qtyNum) || isNaN(rateNum)) {
            alert("Quantity and Rate must be numbers");
            return;
        }

        try {
            // Step 1: Ensure customer exists
            const customerId = await ensureCustomerExists(customer);

            // Step 2: Ensure item exists
            const itemId = await ensureItemExists(item, rateNum);

            // Step 3: Create Sales Order
            const response = await axios.post(
                `${ERP_URL}/Sales Order`,
                {
                    customer: customerId,
                    transaction_date: new Date().toISOString().split("T")[0],
                    delivery_date: new Date().toISOString().split("T")[0],
                    items: [
                        {
                            item_code: itemId,
                            qty: qtyNum,
                            rate: rateNum,
                        },
                    ],
                },
                { headers: ERP_HEADERS }
            );

            setDialogMessage("✅ Sales Order submitted successfully!");
            setDialogVisible(true);

            // reset form
            setCustomer("");
            setItem("");
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
            <Text variant="headlineMedium" style={styles.title}>
                📝 Create & Submit Sales Order
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
                        label="Item Code"
                        value={item}
                        onChangeText={setItem}
                        style={styles.input}
                        mode="outlined"
                    />
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
    title: { textAlign: "center", marginBottom: 20, fontWeight: "bold", color: "#222" },
    card: { borderRadius: 12, elevation: 3, backgroundColor: "#fff", paddingVertical: 10 },
    input: { marginBottom: 15 },
    button: { borderRadius: 8, backgroundColor: "#007AFF", elevation: 2 },
});
