# Infinitrix Order Booking App

A React Native + Expo app for creating and managing Sales Orders.  
This app fetches customers and items from an API (e.g., ERPNext backend), allows selecting customers via dropdown, adding multiple order items, and submitting the Sales Order.

---

## 🚀 Features
- 📌 Fetch customers and items from backend API  
- 📌 Dropdown selection for customers (instead of popup)  
- 📌 Add / remove multiple order item rows dynamically  
- 📌 Auto-fill item details (rate, name) when an item is selected  
- 📌 Submit Sales Order to backend  

---

## 📂 Project Structure

---
   infinitrix-order-booking/
│
├── app/ # Main application source code
│ ├── sale_order.tsx # Sales Order screen (core logic)
│ └── index.tsx # App entry point
│
├── assets/ # Images, fonts, static files
├── components/ # Reusable UI components (if added later)
├── constants/ # App constants
├── hooks/ # Custom hooks
├── scripts/ # Utility scripts
│
├── .expo/ # Expo configuration
├── .idea/ # IDE settings (for JetBrains/WebStorm)
├── node_modules/ # Project dependencies
│
├── app.json # Expo project configuration
├── package.json # NPM dependencies and scripts
├── tsconfig.json # TypeScript config
├── eslint.config.js # ESLint rules
├── README.md # Project documentation
└── .gitignore # Files ignored by Git
```


## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/ehsanjavaid/Infintrix-Order-Booking-App.git
cd infinitrix-order-booking
```
2. Install Dependencies
```bash
npm install
```
3. Run the App (Expo)
```bash
npm start
or 
npx expo start
```
Scan the QR code with Expo Go app on your phone (Android/iOS).

🔑 Key Dependencies

React Native

Expo

React Native Paper
 – UI components

react-native-dropdown-picker
 – modern dropdown picker

📖 Usage

Select a Customer from the dropdown.

Add items to the order:

Choose Item Code (auto-fills item name & rate).

Enter Quantity.

Add or remove rows dynamically.

Click Submit to send the Sales Order to backend API.

🔮 Next Steps

Add authentication (login with API token).

Add offline support (store draft orders locally).

Add Order List screen to view past orders.

👨‍💻 Author

Developed by Ahsan Javaid