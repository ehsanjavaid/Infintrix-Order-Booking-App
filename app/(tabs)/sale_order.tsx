import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    Dialog,
    Paragraph,
    Portal,
    Text,
    TextInput,
    Title,
    Menu,
} from "react-native-paper";

export default function SalesOrderScreen() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedCustomerName, setSelectedCustomerName] = useState("");
    const [orderItems, setOrderItems] = useState<any[]>([
        { item_code: "", item_name: "", qty: "", rate: "" },
    ]);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const [customerMenuVisible, setCustomerMenuVisible] = useState(false);
    const [itemMenuVisible, setItemMenuVisible] = useState<{ [key: number]: boolean }>({});

    const ERP_URL = "http://10.0.2.2:8000/api/resource";
    const ERP_HEADERS = {
        "Content-Type": "application/json",
        Authorization: "token d59aee6dda93b1d:9a4cc3ac4498ca2",
    };

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

    const addItemRow = () =>
        setOrderItems([...orderItems, { item_code: "", item_name: "", qty: "", rate: "" }]);

    const removeItemRow = (index: number) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...orderItems];
        newItems[index][field] = value;

        if (field === "item_code") {
            const itemObj = items.find((i) => i.name === value);
            if (itemObj) {
                newItems[index].rate = itemObj.standard_rate?.toString() || "0";
                newItems[index].item_name = itemObj.item_name;
            }
        }

        setOrderItems(newItems);
    };

    const handleSubmit = async () => {
        if (!selectedCustomer) {
            alert("Please select a customer.");
            return;
        }
        if (orderItems.some((i) => !i.item_code || !i.qty || !i.rate)) {
            alert("Please fill all item details.");
            return;
        }
        try {
            await axios.post(
                `${ERP_URL}/Sales Order`,
                {
                    customer: selectedCustomer,
                    transaction_date: new Date().toISOString().split("T")[0],
                    delivery_date: new Date().toISOString().split("T")[0],
                    items: orderItems.map((i) => ({
                        item_code: i.item_code,
                        qty: parseFloat(i.qty),
                        rate: parseFloat(i.rate),
                    })),
                },
                { headers: ERP_HEADERS }
            );
            setDialogMessage("✅ Sales Order submitted successfully!");
            setDialogVisible(true);
            setSelectedCustomer("");
            setSelectedCustomerName("");
            setOrderItems([{ item_code: "", item_name: "", qty: "", rate: "" }]);
        } catch (err: any) {
            setDialogMessage(`❌ Failed:\n${JSON.stringify(err.response?.data || err.message)}`);
            setDialogVisible(true);
            console.error(err);
        }
    };

    const grandTotal = orderItems.reduce(
        (sum, i) => sum + (parseFloat(i.qty || "0") * parseFloat(i.rate || "0")),
        0
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={styles.header}>🛒 Create Sales Order</Title>

            {/* Customer Section */}
            <Card style={styles.card}>
                <Card.Title title="Customer Details" />
                <Card.Content>
                    <Menu
                        visible={customerMenuVisible}
                        onDismiss={() => setCustomerMenuVisible(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setCustomerMenuVisible(true)}
                                style={styles.input}
                            >
                                {selectedCustomerName || "-- Select Customer --"}
                            </Button>
                        }
                    >
                        {customers.map((c) => (
                            <Menu.Item
                                key={c.name}
                                onPress={() => {
                                    setSelectedCustomer(c.name);
                                    setSelectedCustomerName(c.customer_name);
                                    setCustomerMenuVisible(false);
                                }}
                                title={c.customer_name}
                            />
                        ))}
                    </Menu>
                </Card.Content>
            </Card>

            {/* Items Section */}
            <Card style={styles.card}>
                <Card.Title title="Order Items" />
                <Card.Content>
                    {orderItems.map((item, index) => {
                        const total =
                            item.qty && item.rate
                                ? (parseFloat(item.qty) * parseFloat(item.rate)).toFixed(2)
                                : "0.00";

                        return (
                            <Card key={index} style={styles.itemCard}>
                                <Card.Content>
                                    <Menu
                                        visible={!!itemMenuVisible[index]}
                                        onDismiss={() => setItemMenuVisible({ ...itemMenuVisible, [index]: false })}
                                        anchor={
                                            <Button
                                                mode="outlined"
                                                onPress={() => setItemMenuVisible({ ...itemMenuVisible, [index]: true })}
                                                style={styles.input}
                                            >
                                                {item.item_name || "-- Select Item --"}
                                            </Button>
                                        }
                                    >
                                        {items.map((i) => (
                                            <Menu.Item
                                                key={i.name}
                                                onPress={() => {
                                                    updateItem(index, "item_code", i.name);
                                                    setItemMenuVisible({ ...itemMenuVisible, [index]: false });
                                                }}
                                                title={i.item_name}
                                            />
                                        ))}
                                    </Menu>

                                    <View style={styles.row}>
                                        <TextInput
                                            label="Qty"
                                            value={item.qty}
                                            onChangeText={(val) => updateItem(index, "qty", val)}
                                            keyboardType="numeric"
                                            style={[styles.input, styles.smallInput]}
                                            mode="outlined"
                                        />
                                        <TextInput
                                            label="Rate"
                                            value={item.rate}
                                            onChangeText={(val) => updateItem(index, "rate", val)}
                                            keyboardType="numeric"
                                            style={[styles.input, styles.smallInput]}
                                            mode="outlined"
                                        />
                                        <TextInput
                                            label="Total"
                                            value={total}
                                            style={[styles.input, styles.smallInput]}
                                            mode="outlined"
                                            editable={false}
                                        />
                                    </View>

                                    {orderItems.length > 1 && (
                                        <Button
                                            mode="outlined"
                                            onPress={() => removeItemRow(index)}
                                            style={styles.removeBtn}
                                        >
                                            Remove Item
                                        </Button>
                                    )}
                                </Card.Content>
                            </Card>
                        );
                    })}

                    <Button mode="outlined" onPress={addItemRow} style={styles.addBtn}>
                        + Add Another Item
                    </Button>
                </Card.Content>
            </Card>

            {/* Grand Total */}
            <Card style={styles.card}>
                <Card.Title title="Summary" />
                <Card.Content>
                    <Text style={styles.totalText}>Grand Total: PKR {grandTotal.toFixed(2)}</Text>
                </Card.Content>
            </Card>

            {/* Submit */}
            <Button mode="contained" onPress={handleSubmit} style={styles.submitBtn}>
                ✅ Submit Sales Order
            </Button>

            {/* Result Dialog */}
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
    container: { flexGrow: 1, padding: 20, marginTop: 10, backgroundColor: "#f4f6f9" },
    header: { textAlign: "center", fontSize: 22, marginBottom: 15, fontWeight: "bold" },
    card: { borderRadius: 12, marginBottom: 15, backgroundColor: "#fff", elevation: 3 },
    input: { marginBottom: 15, backgroundColor: "#fafafa" },
    row: { flexDirection: "row", justifyContent: "space-between" },
    smallInput: { flex: 1, marginHorizontal: 5 },
    itemCard: { marginBottom: 15, borderRadius: 10, backgroundColor: "#fefefe", elevation: 2 },
    addBtn: { borderRadius: 8, marginTop: 10, borderColor: "#007AFF" },
    removeBtn: { marginTop: 10, borderColor: "red" },
    submitBtn: { marginTop: 20, borderRadius: 8, backgroundColor: "#007AFF", padding: 5 },
    totalText: { fontSize: 18, fontWeight: "bold", textAlign: "right" },
});
