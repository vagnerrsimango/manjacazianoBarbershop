import api from "./api";
import { API_ENDPOINTS } from "./constants";

// Product interface
export interface IProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Product response interface
export interface IProductResponse {
  success: boolean;
  message: string;
  data: IProduct[];
}

// Single product response interface
export interface ISingleProductResponse {
  success: boolean;
  message: string;
  data: IProduct;
}

// Create/Update product interface
export interface IProductFormData {
  name: string;
  price: number;
  description?: string;
  category?: string;
  isActive?: boolean;
}

// Product service class
class ProductService {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<IProductResponse> {
    try {
      console.log("🛍️ Fetching all products...");
      const response = await api.get(
        API_ENDPOINTS.PRODUCTS?.GET_ALL || "/products"
      );
      console.log("✅ Products fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching products:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<ISingleProductResponse> {
    try {
      console.log(`🛍️ Fetching product with ID: ${id}`);
      const response = await api.get(`/products/${id}`);
      console.log("✅ Product fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error fetching product with ID ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new product
   */
  async createProduct(
    productData: IProductFormData
  ): Promise<ISingleProductResponse> {
    try {
      console.log("🛍️ Creating new product:", productData);
      const response = await api.post(
        API_ENDPOINTS.PRODUCTS?.CREATE || "/products",
        productData
      );
      console.log("✅ Product created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error creating product:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(
    id: number,
    productData: IProductFormData
  ): Promise<ISingleProductResponse> {
    try {
      console.log(`🛍️ Updating product with ID: ${id}`, productData);
      const response = await api.put(`/products/${id}`, productData);
      console.log("✅ Product updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating product with ID ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🛍️ Deleting product with ID: ${id}`);
      const response = await api.delete(`/products/${id}`);
      console.log("✅ Product deleted successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error deleting product with ID ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Search products by name or category
   */
  async searchProducts(query: string): Promise<IProductResponse> {
    try {
      console.log(`🛍️ Searching products with query: ${query}`);
      const response = await api.get(
        `/products/search?q=${encodeURIComponent(query)}`
      );
      console.log("✅ Products search completed:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error searching products:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "Erro do servidor";
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error("Erro de conexão. Verifique sua internet.");
    } else {
      // Something else happened
      return new Error(error.message || "Erro desconhecido");
    }
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;
