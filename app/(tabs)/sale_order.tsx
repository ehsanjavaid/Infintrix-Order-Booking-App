import axios from "axios";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Dialog, Paragraph, Portal, Text, TextInput } from "react-native-paper";

export default function SalesOrderScreen() {
    const [customer, setCustomer] = useState("");
    const [item, setItem] = useState("");
    const [qty, setQty] = useState("");
    const [rate, setRate] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const handleSubmit = async () => {
        if (!customer || !item || !qty || !rate) {
            alert("Please fill in all fields.");
            return;
        }

        const qtyNum = parseFloat(qty);
        const rateNum = parseFloat(rate);

        if (isNaN(qtyNum) || isNaN(rateNum)) {
            alert("Quantity and Rate must be numbers");
            return;
        }

        try {
            // 1️⃣ Create Sales Order (Draft)
            const createResponse = await axios.post(
                "http://10.0.2.2:8000/api/resource/Sales Orders",
                {
                    customer: customer,
                    transaction_date: new Date().toISOString().split("T")[0],
                    delivery_date: new Date().toISOString().split("T")[0],
                    items: [
                        {
                            item_code: item,
                            qty: qtyNum,
                            rate: rateNum,
                        },
                    ],
                    docstatus: 1
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "token f9282e31b78ebd0:c1aa94e0bdc9f0a",
                    },
                }
            );

            // const docname = createResponse.data.data.name;
            // console.log("Draft Created:", docname);

            // // 2️⃣ Submit the Sales Order
            // const submitResponse = await axios.post(
            //     `http://10.0.2.2:8000/api/method/frappe.client.submit`,
            //     {
            //         doc: JSON.stringify({
            //             doctype: "Sales Orders",
            //             name: docname
            //         })
            //     },
            //     {
            //         headers: {
            //             "Content-Type": "application/json",
            //             Authorization: "token f9282e31b78ebd0:c1aa94e0bdc9f0a",
            //         },
            //     }
            // );

            console.log("✅ Sales Order Submitted:", createResponse.data);
            setDialogMessage("✅ Order submitted successfully!");
            setDialogVisible(true);

            // Reset form
            setCustomer("");
            setItem("");
            setQty("");
            setRate("");
        } catch (error: any) {
            console.error("❌ Error:", error.response?.data || error.message);
            setDialogMessage(
                `❌ Failed to submit order:\n${JSON.stringify(error.response?.data || error.message)}`
            );
            setDialogVisible(true);
        }
    };

    const total = qty && rate ? (parseFloat(qty) * parseFloat(rate)).toString() : "0";

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
