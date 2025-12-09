import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    transaction_id: { type: String, alias: "Transaction ID", required: true, index: true },
    date: { type: Date, alias: "Date", required: true, index: true },

    customer_id: { type: String, alias: "Customer ID", required: true, index: true },
    customer_name: { type: String, alias: "Customer Name", required: true },
    phone_number: { type: String, alias: "Phone Number" },
    gender: { type: String, alias: "Gender", enum: ["Male", "Female", "Other"] },
    age: { type: Number, alias: "Age" },
    customer_region: { type: String, alias: "Customer Region", required: true },
    customer_type: { type: String, alias: "Customer Type" },

    product_id: { type: String, alias: "Product ID", required: true },
    product_name: { type: String, alias: "Product Name", required: true },
    brand: { type: String, alias: "Brand" },
    product_category: { type: String, alias: "Product Category" },
    tags: { type: [String], alias: "Tags" },

    quantity: { type: Number, alias: "Quantity", required: true },
    price_per_unit: { type: Number, alias: "Price per Unit", required: true },
    discount_percentage: { type: Number, alias: "Discount Percentage" },
    total_amount: { type: Number, alias: "Total Amount" },
    final_amount: { type: Number, alias: "Final Amount" },

    payment_method: { type: String, alias: "Payment Method", required: true },
    order_status: { type: String, alias: "Order Status" },
    delivery_type: { type: String, alias: "Delivery Type" },

    store_id: { type: String, alias: "Store ID" },
    store_location: { type: String, alias: "Store Location" },
    salesperson_id: { type: String, alias: "Salesperson ID" },
    employee_name: { type: String, alias: "Employee Name" },
  },
  { strict: false }
);
const Sale = mongoose.model('Sale', SaleSchema);
export default Sale;