"use client";

import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Appicon";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("API did not return an array:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) =>
          Array.isArray(prev) ? prev.filter((o) => o.id !== id) : [],
        );
        if (selectedOrder?.id === id) setSelectedOrder(null);
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setOrders((prev) =>
      Array.isArray(prev)
        ? prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        : [],
    );
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev: any) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
    try {
      await fetch(`/api/admin/orders?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status on server:", error);
    }
  };

  const filtered = Array.isArray(orders)
    ? orders.filter((o) => {
        const matchStatus = filterStatus === "All" || o.status === filterStatus;
        const q = search.toLowerCase();
        const matchSearch =
          (o.customerName || "").toLowerCase().includes(q) ||
          (o.id || "").toLowerCase().includes(q) ||
          (o.phone || "").toLowerCase().includes(q) ||
          (o.email || "").toLowerCase().includes(q) ||
          (o.address || "").toLowerCase().includes(q) ||
          (o.city || "").toLowerCase().includes(q) ||
          (o.state || "").toLowerCase().includes(q) ||
          (o.pincode || "").toLowerCase().includes(q);
        return matchStatus && matchSearch;
      })
    : [];

  const getStatusCount = (status: string) => {
    if (!Array.isArray(orders)) return 0;
    if (status === "All") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const formatFullAddress = (o: any) => {
    const parts = [
      o.address,
      o.city,
      o.state ? `${o.state}${o.pincode ? ` - ${o.pincode}` : ""}` : o.pincode,
      o.country || "India",
    ].filter(Boolean);
    return parts.join(", ");
  };

  const copyShippingAddress = (o: any) => {
    const text = `Deliver To: ${o.customerName}
Phone: ${o.phone}${o.email ? `\nEmail: ${o.email}` : ""}
Address: ${formatFullAddress(o)}${o.notes ? `\nInstructions/Notes: ${o.notes}` : ""}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Orders & Shipping Management
          </h2>
          <p className="text-xs text-muted-foreground">
            View customer orders, manage shipping addresses, and update delivery
            status.
          </p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto hide-scrollbar bg-muted/20">
          {["All", ...statusOptions].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                filterStatus === s
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {s}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  filterStatus === s
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {getStatusCount(s)}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-border bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Icon
              name="MagnifyingGlassIcon"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by order ID, name, phone, state, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden -mt-4 rounded-t-none border-t-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {[
                  "Order ID",
                  "Customer Info",
                  "Shipping Address",
                  "Items",
                  "Amount",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td
                      className="px-4 py-3 font-mono text-xs text-primary font-semibold max-w-[110px] truncate"
                      title={order.id}
                    >
                      {order.id}
                    </td>

                    {/* Customer Info */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground whitespace-nowrap">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.phone}
                        </p>
                        {order.email && (
                          <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                            {order.email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Shipping Address */}
                    <td className="px-4 py-3 max-w-[240px]">
                      <div>
                        <p
                          className="text-xs text-foreground font-medium line-clamp-2"
                          title={formatFullAddress(order)}
                        >
                          {formatFullAddress(order)}
                        </p>
                        {order.state && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                            {order.state}
                          </span>
                        )}
                        {order.notes && (
                          <p
                            className="text-[11px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 border border-amber-200 truncate"
                            title={order.notes}
                          >
                            Note: {order.notes}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <ul className="list-disc list-inside">
                        {order.items?.map((item: any) => (
                          <li key={item.id} className="truncate max-w-[180px]">
                            {item.product?.name || `Product #${item.productId}`}{" "}
                            ({item.packSize}) x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* Total Amount */}
                    <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 items-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded text-xs font-semibold transition-colors whitespace-nowrap"
                          title="View Full Details & Address"
                        >
                          Details
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="bg-muted border border-border rounded text-xs px-1.5 py-1 focus:outline-none focus:border-primary cursor-pointer"
                        >
                          {statusOptions.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors"
                          title="Delete Order"
                        >
                          <Icon name="TrashIcon" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {filtered.length} orders shown
          </p>
        </div>
      </div>

      {/* Order & Shipping Address Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-border pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Order Details & Shipping Info
                </h3>
                <p className="text-xs font-mono text-muted-foreground">
                  ID: {selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Status & Date */}
            <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg border border-border">
              <div>
                <span className="text-xs text-muted-foreground block">
                  Order Date
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block mb-1">
                  Status
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[selectedOrder.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm text-emerald-900 flex items-center gap-1.5">
                  <Icon
                    name="MapPinIcon"
                    size={16}
                    className="text-emerald-600"
                  />
                  Shipping Address & Contact
                </h4>
                <button
                  onClick={() => copyShippingAddress(selectedOrder)}
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-1"
                >
                  <Icon name="ClipboardDocumentIcon" size={13} />
                  {copied ? "Copied!" : "Copy Label"}
                </button>
              </div>

              <div className="text-xs text-foreground space-y-1 bg-white p-3 rounded-lg border border-emerald-100">
                <p className="font-bold text-sm text-foreground">
                  {selectedOrder.customerName}
                </p>
                <p>
                  <span className="font-semibold text-muted-foreground">
                    Phone:
                  </span>{" "}
                  {selectedOrder.phone}
                </p>
                {selectedOrder.email && (
                  <p>
                    <span className="font-semibold text-muted-foreground">
                      Email:
                    </span>{" "}
                    {selectedOrder.email}
                  </p>
                )}
                <hr className="my-2 border-border" />
                <p>
                  <span className="font-semibold text-muted-foreground">
                    Street:
                  </span>{" "}
                  {selectedOrder.address}
                </p>
                {selectedOrder.city && (
                  <p>
                    <span className="font-semibold text-muted-foreground">
                      City:
                    </span>{" "}
                    {selectedOrder.city}
                  </p>
                )}
                {selectedOrder.state && (
                  <p>
                    <span className="font-semibold text-muted-foreground">
                      State:
                    </span>{" "}
                    {selectedOrder.state}
                  </p>
                )}
                {selectedOrder.pincode && (
                  <p>
                    <span className="font-semibold text-muted-foreground">
                      Pincode:
                    </span>{" "}
                    {selectedOrder.pincode}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-muted-foreground">
                    Country:
                  </span>{" "}
                  {selectedOrder.country || "India"}
                </p>
                {selectedOrder.notes && (
                  <div className="mt-2 p-2 bg-amber-50 text-amber-900 rounded border border-amber-200">
                    <p className="font-semibold text-[11px] text-amber-700">
                      Delivery Instructions / Notes:
                    </p>
                    <p className="text-xs mt-0.5">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">
                Order Items
              </h4>
              <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                {selectedOrder.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3 flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.product?.name || `Product #${item.productId}`}
                      </p>
                      <p className="text-muted-foreground">
                        Pack: {item.packSize} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-foreground text-sm">
                <span>Total Amount:</span>
                <span className="text-primary text-base">
                  ₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
