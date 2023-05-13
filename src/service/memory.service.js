export class CartsMemoryService {
    constructor(dao) {
      this.dao = dao;
    }
    async create(cartData) {}
    async getById(cartId) {}
    async addProduct(cartId, productId, productQty) {}
    async deleteProduct(cartId, productId) {}
    async updateProductQty(cartId, productId, productQty) {}
    async deleteProducts(cartId) {}
  }
  
  export class ProductsMemoryService {
    constructor(dao) {
      this.dao = dao;
    }
    async getPaginated(query) {}
    async getById(productId) {}
    async getByCode(productCode) {}
    async deleteById(productId) {}
    async create(productData) {}
    async updateById(productId, update) {}
    async updateStockById(productId, quantity) {}
  }
  
  export class MessagesMemoryService {
    constructor(dao) {
      this.dao = dao;
    }
    async get() {}
    async send(messageData) {}
  }
  
  export class UsersMemoryService {
    constructor(dao) {
      this.dao = dao;
    }
    async getById(userId) {}
    async getByEmail(userEmail) {}
    async getCurrentByEmail(userEmail) {}
    async create(userData) {}
    async updateByEmail(email, update) {}
  }
  
  export class TicketsMemoryService {
    constructor(dao) {
      this.dao = dao;
    }
    async send(ticketData) {}
  }