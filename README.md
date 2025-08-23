# Manjacaziano Barbershop - Customer Management System

## Overview

This project implements a comprehensive customer management system for the Manjacaziano Barbershop, featuring all the backend endpoints specified in the API documentation with performance optimizations and best practices.

## 🚀 Features Implemented

### ✅ Complete API Endpoints Implementation

All 10 customer API endpoints have been implemented according to the documentation:

1. **Create Customer** - `POST /customers`
2. **Get All Customers** - `GET /customers`
3. **Get Customer by ID** - `GET /customers/:id`
4. **Update Customer** - `PUT /customers`
5. **Delete Customer** - `DELETE /customers/:id`
6. **Add Debt** - `POST /customers/debt`
7. **Pay Debt** - `POST /customers/pay-debt`
8. **Get Customer Debt History** - `GET /customers/:id/debt-history`
9. **Search Customers** - `GET /customers/search?query=term`
10. **Get All Debts** - `GET /debts?sort=asc|desc`

### 🏗️ Architecture & Best Practices

- **Singleton Pattern** - Customer service uses singleton for efficient resource management
- **TypeScript Types** - Comprehensive type definitions for all API operations
- **Error Handling** - Consistent error handling with proper HTTP status codes
- **Response Validation** - API response structure validation
- **Retry Logic** - Exponential backoff retry mechanism for failed requests
- **Request Cancellation** - AbortController for canceling in-flight requests

### ⚡ Performance Optimizations

- **Intelligent Caching** - 5-minute cache duration with pattern-based invalidation
- **Request Deduplication** - Prevents duplicate requests for the same data
- **Lazy Loading** - Data loaded only when needed
- **Optimistic Updates** - UI updates immediately while API calls complete
- **Memory Management** - Proper cleanup of cached data and request controllers

### 🔒 Security & Reliability

- **Authentication** - JWT token handling with automatic header injection
- **Input Validation** - Client-side validation before API calls
- **Error Boundaries** - Graceful error handling and user feedback
- **Network Resilience** - Handles offline scenarios and connection issues
- **Data Integrity** - Consistent state management across operations

## 📁 Project Structure

```
src/
├── @types/
│   └── api.d.ts                 # TypeScript interfaces for API
├── components/                   # Reusable UI components
├── screens/
│   ├── ClientScreen.tsx         # Updated client screen with new API
│   └── CustomerManagementScreen.tsx  # Comprehensive customer management
├── utils/
│   ├── network/
│   │   ├── api.ts              # Axios configuration with interceptors
│   │   ├── constants.ts        # API constants and configuration
│   │   ├── customerService.ts  # Main customer service implementation
│   │   └── responseHandler.ts  # Response processing and error handling
│   └── hooks/
│       └── useCustomerService.ts # React hook for customer operations
```

## 🛠️ Technical Implementation

### API Configuration (`src/utils/network/api.ts`)

- **Base URL**: `http://localhost:7777`
- **Timeout**: 10 seconds
- **Authentication**: Automatic JWT token injection
- **Interceptors**: Request/response handling and error management

### Customer Service (`src/utils/network/customerService.ts`)

- **Singleton Pattern**: Efficient resource management
- **Caching Strategy**: Intelligent cache invalidation
- **Retry Logic**: Exponential backoff for failed requests
- **Error Handling**: Consistent error responses

### Response Handler (`src/utils/network/responseHandler.ts`)

- **Error Mapping**: HTTP status codes to user-friendly messages
- **Retry Logic**: Automatic retry for transient failures
- **Response Validation**: API response structure validation
- **Data Transformation**: Date formatting and currency handling

### React Hook (`src/utils/hooks/useCustomerService.ts`)

- **State Management**: Local state for customers, loading, errors
- **Request Cancellation**: AbortController for canceling requests
- **Optimistic Updates**: Immediate UI feedback
- **Error Recovery**: Retry mechanisms and error clearing

## 🎯 Usage Examples

### Basic Customer Operations

```typescript
import { useCustomerService } from '../utils/hooks/useCustomerService';

function CustomerComponent() {
  const {
    customers,
    loading,
    error,
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomerService();

  useEffect(() => {
    getAllCustomers();
  }, []);

  const handleCreate = async () => {
    const success = await createCustomer({
      name: "João Silva",
      phone: "258841234567",
      birthday: "1990-05-15"
    });
    
    if (success) {
      // Customer created successfully
    }
  };

  // ... rest of component
}
```

### Debt Management

```typescript
const { addDebt, payDebt } = useCustomerService();

// Add debt
const success = await addDebt({
  clientId: 1,
  amount: 50.00,
  description: "Serviço de corte de cabelo",
  paymentMethodId: 1,
  userId: 1
});

// Pay debt
const success = await payDebt({
  clientId: 1,
  amount: 25.00,
  description: "Pagamento parcial",
  paymentMethodId: 1,
  userId: 1
});
```

### Search and Filtering

```typescript
const { searchCustomers, getAllDebts } = useCustomerService();

// Search customers
const results = await searchCustomers({ query: "joão" });

// Get debts with sorting
await getAllDebts({ sort: "desc" }); // Newest first
await getAllDebts({ sort: "asc" });  // Oldest first
```

## 🔧 Configuration

### Environment Variables

The system is configured to work with the local backend at `http://localhost:7777`. To change this:

1. Update `src/utils/network/constants.ts`
2. Modify `API_CONFIG.BASE_URL`
3. Update timeout and retry settings as needed

### Cache Configuration

- **Cache Duration**: 5 minutes (configurable)
- **Cache Keys**: Pattern-based for efficient invalidation
- **Memory Management**: Automatic cleanup of expired cache entries

## 📱 UI Components

### CustomerManagementScreen

A comprehensive screen showcasing all API endpoints:

- **Customer List**: View all customers with balance indicators
- **Create Customer**: Add new customers with validation
- **Edit Customer**: Modify existing customer information
- **Debt Management**: Add debts and process payments
- **Search**: Find customers by name or phone
- **Debt History**: View all debts with sorting options

### ClientScreen

Updated existing screen with new API integration:

- **Customer List**: Displays customers with debt information
- **Payment Processing**: Handle debt payments
- **Error Handling**: User-friendly error messages
- **Loading States**: Proper loading indicators

## 🚦 Performance Features

### Caching Strategy

- **Intelligent Invalidation**: Cache cleared only when related data changes
- **Pattern Matching**: Efficient cache key management
- **Memory Optimization**: Automatic cleanup of expired entries

### Request Optimization

- **Request Deduplication**: Prevents duplicate API calls
- **Batch Operations**: Efficient data fetching
- **Lazy Loading**: Data loaded on demand

### Error Recovery

- **Automatic Retries**: Exponential backoff for transient failures
- **Graceful Degradation**: Fallback behavior for failed requests
- **User Feedback**: Clear error messages and recovery options

## 🔍 Error Handling

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Not Found
- **500**: Internal Server Error

### Error Messages

- **User-Friendly**: Clear, actionable error messages
- **Context-Aware**: Specific error information for debugging
- **Recovery Options**: Suggested actions for common errors

## 🧪 Testing Considerations

### API Testing

- **Mock Responses**: Easy to mock for testing
- **Error Scenarios**: Comprehensive error handling testing
- **Performance Testing**: Cache and retry logic validation

### Component Testing

- **Hook Testing**: Test customer service hook in isolation
- **UI Testing**: Component rendering and user interactions
- **Integration Testing**: End-to-end API workflow testing

## 🚀 Future Enhancements

### Planned Features

- **Real-time Updates**: WebSocket integration for live data
- **Offline Support**: Service worker for offline functionality
- **Advanced Caching**: Redis-like cache with persistence
- **Analytics**: Performance monitoring and usage analytics
- **Push Notifications**: Debt reminders and payment confirmations

### Scalability Improvements

- **Pagination**: Handle large customer datasets
- **Virtual Scrolling**: Efficient rendering of long lists
- **Background Sync**: Sync data when connection is restored
- **Compression**: Optimize network payload sizes

## 📚 API Documentation

For detailed API endpoint documentation, refer to the original specification document. All endpoints have been implemented according to the specifications with additional performance and reliability features.

## 🤝 Contributing

1. Follow the established code structure
2. Maintain TypeScript types and interfaces
3. Add proper error handling for new features
4. Include performance considerations
5. Update documentation for new endpoints

## 📄 License

This project is part of the Manjacaziano Barbershop management system.
