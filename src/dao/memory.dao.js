export class CartsMemoryDao {
    async getCart(cid) {}
    async addProduct(cid, pid, qty) {}
    async deleteProduct(cid, pid) {}
    async updateProductQty(cid, pid, qty) {}
    async deleteProducts(cid) {}
  }
  
  export class ProductsMemoryDao {
    async getProducts(query, options) {}
    async getProduct(pid) {}
    async getProductByCode(code) {}
    async deleteProduct(pid) {}
    async createProduct(product) {}
    async updateProduct(pid, field, value) {}
  }
  
  export class MessagesMemoryDao {
    async getMessages() {}
    async addMessage(data) {}
  }
  
  export class UsersMemoryDao {
    async getUser(field, value) {}
  }