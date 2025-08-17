/**
 * Customer Service Tests
 *
 * This file demonstrates how to test the customer service implementation.
 * In a real project, you would use Jest or another testing framework.
 */

import { customerService } from "../customerService";
import { Customer, CustomerCreateRequest } from "../../../@types/api";

// Mock data for testing
const mockCustomer: Customer = {
  id: 1,
  name: "João Silva",
  phone: "258841234567",
  birthday: "1990-05-15",
  balance: 0.0,
  total_purchases: 0,
  total_paid: 0.0,
  created_at: "2024-01-15T10:30:00.000Z",
  updated_at: "2024-01-15T10:30:00.000Z",
};

const mockCreateRequest: CustomerCreateRequest = {
  name: "Maria Santos",
  phone: "258849876543",
  birthday: "1985-08-20",
};

// Example test functions (these would be actual Jest tests in a real project)
export const customerServiceTests = {
  /**
   * Test customer creation
   */
  testCreateCustomer: async () => {
    try {
      console.log("Testing customer creation...");

      // This would be a mock in real tests
      const result = await customerService.createCustomer(mockCreateRequest);

      console.log("✅ Customer created successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Customer creation failed:", error);
      return false;
    }
  },

  /**
   * Test getting all customers
   */
  testGetAllCustomers: async () => {
    try {
      console.log("Testing get all customers...");

      const result = await customerService.getAllCustomers();

      console.log("✅ Customers retrieved successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Get all customers failed:", error);
      return false;
    }
  },

  /**
   * Test getting customer by ID
   */
  testGetCustomerById: async () => {
    try {
      console.log("Testing get customer by ID...");

      const result = await customerService.getCustomerById(1);

      console.log("✅ Customer retrieved successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Get customer by ID failed:", error);
      return false;
    }
  },

  /**
   * Test customer update
   */
  testUpdateCustomer: async () => {
    try {
      console.log("Testing customer update...");

      const updateData = {
        id: 1,
        name: "João Silva Santos",
        phone: "258841234567",
        birthday: "1990-05-15",
      };

      const result = await customerService.updateCustomer(updateData);

      console.log("✅ Customer updated successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Customer update failed:", error);
      return false;
    }
  },

  /**
   * Test adding debt
   */
  testAddDebt: async () => {
    try {
      console.log("Testing add debt...");

      const debtData = {
        clientId: 1,
        amount: 50.0,
        description: "Serviço de corte de cabelo",
        paymentMethodId: 1,
        userId: 1,
      };

      const result = await customerService.addDebt(debtData);

      console.log("✅ Debt added successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Add debt failed:", error);
      return false;
    }
  },

  /**
   * Test paying debt
   */
  testPayDebt: async () => {
    try {
      console.log("Testing pay debt...");

      const paymentData = {
        clientId: 1,
        amount: 25.0,
        description: "Pagamento parcial da dívida",
        paymentMethodId: 1,
        userId: 1,
      };

      const result = await customerService.payDebt(paymentData);

      console.log("✅ Debt payment successful:", result);
      return true;
    } catch (error) {
      console.error("❌ Pay debt failed:", error);
      return false;
    }
  },

  /**
   * Test search customers
   */
  testSearchCustomers: async () => {
    try {
      console.log("Testing search customers...");

      const result = await customerService.searchCustomers({ query: "joão" });

      console.log("✅ Customer search successful:", result);
      return true;
    } catch (error) {
      console.error("❌ Customer search failed:", error);
      return false;
    }
  },

  /**
   * Test get all debts
   */
  testGetAllDebts: async () => {
    try {
      console.log("Testing get all debts...");

      const result = await customerService.getAllDebts({ sort: "desc" });

      console.log("✅ Get all debts successful:", result);
      return true;
    } catch (error) {
      console.error("❌ Get all debts failed:", error);
      return false;
    }
  },

  /**
   * Test cache functionality
   */
  testCacheFunctionality: () => {
    try {
      console.log("Testing cache functionality...");

      // Test cache clearing
      customerService.clearCache();
      console.log("✅ Cache cleared successfully");

      return true;
    } catch (error) {
      console.error("❌ Cache functionality failed:", error);
      return false;
    }
  },

  /**
   * Run all tests
   */
  runAllTests: async () => {
    console.log("🚀 Starting Customer Service Tests...\n");

    const tests = [
      { name: "Create Customer", fn: customerServiceTests.testCreateCustomer },
      {
        name: "Get All Customers",
        fn: customerServiceTests.testGetAllCustomers,
      },
      {
        name: "Get Customer by ID",
        fn: customerServiceTests.testGetCustomerById,
      },
      { name: "Update Customer", fn: customerServiceTests.testUpdateCustomer },
      { name: "Add Debt", fn: customerServiceTests.testAddDebt },
      { name: "Pay Debt", fn: customerServiceTests.testPayDebt },
      {
        name: "Search Customers",
        fn: customerServiceTests.testSearchCustomers,
      },
      { name: "Get All Debts", fn: customerServiceTests.testGetAllDebts },
      {
        name: "Cache Functionality",
        fn: customerServiceTests.testCacheFunctionality,
      },
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      console.log(`\n📋 Running: ${test.name}`);
      const result = await test.fn();

      if (result) {
        passed++;
      } else {
        failed++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`🎯 Test Results: ${passed} passed, ${failed} failed`);
    console.log("=".repeat(50));

    return { passed, failed };
  },
};

// Example usage in development
if (__DEV__) {
  // Uncomment to run tests in development
  // customerServiceTests.runAllTests();
}

export default customerServiceTests;
