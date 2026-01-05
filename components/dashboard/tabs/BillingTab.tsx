// components/dashboard/tabs/BillingTab.tsx
"use client";

import {
  CreditCard,
  DollarSign,
  Receipt,
  Download,
  Calendar,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function BillingTab() {
  const transactions = [
    { id: 1, user: "John Smith", date: "Apr 15, 2024", amount: "$150.00", status: "paid", type: "Consultation" },
    { id: 2, user: "Sarah Johnson", date: "Apr 14, 2024", amount: "$200.00", status: "paid", type: "Subscription" },
    { id: 3, user: "Mike Wilson", date: "Apr 13, 2024", amount: "$120.00", status: "pending", type: "Consultation" },
    { id: 4, user: "Emma Davis", date: "Apr 12, 2024", amount: "$180.00", status: "failed", type: "Service" },
    { id: 5, user: "Robert Brown", date: "Apr 11, 2024", amount: "$250.00", status: "paid", type: "Subscription" },
  ];

  const subscriptionPlans = [
    { name: "Basic", price: "$29", users: "Up to 10", features: ["Basic support", "3 consultants", "Email support"] },
    { name: "Professional", price: "$79", users: "Up to 50", features: ["Priority support", "10 consultants", "Phone support"], popular: true },
    { name: "Enterprise", price: "$199", users: "Unlimited", features: ["24/7 support", "Unlimited consultants", "Dedicated manager"] },
  ];

  const billingStats = [
    { label: "Total Revenue", value: "$12,543", change: "+24.3%" },
    { label: "Pending Payments", value: "$1,250", change: "-12%" },
    { label: "Avg. Transaction", value: "$145", change: "+8%" },
    { label: "Active Subscriptions", value: "42", change: "+5" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Billing & Subscriptions</h2>
          <p className="text-gray-600">Manage payments, invoices, and subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            This Month
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-green-400 text-white rounded-xl hover:shadow-lg">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <span className="text-green-600">{stat.change}</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View all →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{transaction.user}</p>
                    <p className="text-sm text-gray-600 mt-1">{transaction.type} • {transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">{transaction.amount}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Subscription Plans</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-4 border rounded-xl ${plan.popular ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                >
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-full mb-3">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">{plan.name}</h4>
                      <p className="text-sm text-gray-600">{plan.users} users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-800">{plan.price}</p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2 rounded-lg ${plan.popular ? 'bg-linear-to-r from-blue-600 to-green-400 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    {plan.popular ? 'Get Started' : 'Learn More'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Management */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Invoice Management</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 text-center">
            <Receipt className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium">Generate Invoice</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 text-center">
            <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium">Payment Settings</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 text-center">
            <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium">Export Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}