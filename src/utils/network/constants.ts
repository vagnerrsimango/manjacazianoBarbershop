// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: "https://apimanjacaziano.geome.site",
  TIMEOUT: 10000, // 10 seconds
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Customer endpoints
  CUSTOMERS: {
    BASE: "/customers",
    CREATE: "/customers",
    GET_ALL: "/customers",
    GET_BY_ID: (id: number) => `/customers/${id}`,
    UPDATE: "/customers",
    DELETE: (id: number) => `/customers/${id}`,
    SEARCH: "/customers/search",
    DEBT: "/customers/debt",
    PAY_DEBT: "/customers/pay-debt",
    DEBT_HISTORY: (id: number) => `/customers/${id}/debt-history`,
  },

  // Debt endpoints
  DEBTS: {
    BASE: "/debts",
    GET_ALL: "/debts",
  },

  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
  },

  // User endpoints
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
  },

  // Product endpoints
  PRODUCTS: {
    BASE: "/products",
    CREATE: "/products",
    GET_ALL: "/products",
    GET_BY_ID: (id: number) => `/products/${id}`,
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    SEARCH: "/products/search",
  },

  // Category endpoints
  CATEGORIES: {
    BASE: "/categories",
    GET_ALL: "/categories",
  },

  // Payment methods
  PAYMENT_METHODS: {
    BASE: "/payment-methods",
    GET_ALL: "/payment-methods",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet.",
  TIMEOUT_ERROR: "Tempo limite excedido. Tente novamente.",
  UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
  FORBIDDEN: "Acesso negado. Você não tem permissão para esta ação.",
  NOT_FOUND: "Recurso não encontrado.",
  VALIDATION_ERROR: "Dados inválidos. Verifique as informações.",
  SERVER_ERROR: "Erro interno do servidor. Tente novamente mais tarde.",
  UNKNOWN_ERROR: "Erro desconhecido. Tente novamente.",
} as const;

// Cache Keys
export const CACHE_KEYS = {
  CUSTOMERS: "customers",
  CUSTOMER: (id: number) => `customer_${id}`,
  DEBTS: "debts",
  DEBT_HISTORY: (id: number) => `debt_history_${id}`,
  USER_PROFILE: "user_profile",
  PAYMENT_METHODS: "payment_methods",
} as const;

// Request Headers
export const HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
  USER_AGENT: "User-Agent",
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  TEXT: "text/plain",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  MIN_SEARCH_QUERY_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_PHONE_LENGTH: 20,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
} as const;

// Date Formats
export const DATE_FORMATS = {
  API_DATE: "YYYY-MM-DD",
  API_DATETIME: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  DISPLAY_DATE: "DD/MM/YYYY",
  DISPLAY_DATETIME: "DD/MM/YYYY HH:mm",
} as const;

// Currency
export const CURRENCY = {
  CODE: "MZN",
  SYMBOL: "MT",
  DECIMAL_PLACES: 2,
} as const;
