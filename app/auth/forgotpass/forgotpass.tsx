'use client'
import { useState } from "react";

export default function ForgotPass(){
    return <div className="min-h-0">
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            <form className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter your Email"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition"
                    >
                        Reset Password
                    </button>
                </div>
                </form> 
            </div>
    </div>
}