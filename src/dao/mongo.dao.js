import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import { usersModel } from "../models/users.model.js";
import { ordersModel } from "../models/orders.model.js";
import { logger } from "../utils/logger.utils.js";
import { tokensModel } from "../models/tokens.model.js";

export class CartsMongoDao {
  async create() {
    try {
      let result = await cartsModel.create({});
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async getOne(conditions, projection) {
    try {
      let result = await cartsModel
        .findOne(conditions, projection)
        .populate("products.product");
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await cartsModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
}

export class ProductsMongoDao {
  async getPaginated(filter, options) {
    try {
      let result = await productsModel.paginate(filter, options);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async getOne(conditions, projection) {
    try {
      let result = await productsModel.findOne(conditions, projection);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async deleteOne(conditions) {
    try {
      let result = await productsModel.deleteOne(conditions);
      if (result.deletedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async create(docs) {
    try {
      let result = await productsModel.create(docs);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await productsModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
}

export class UsersMongoDao {
  async getOne(conditions, projection) {
    try {
      let result = await usersModel.findOne(conditions, projection);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async create(docs) {
    try {
      let result = await usersModel.create(docs);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await usersModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
}

export class OrdersMongoDao {
  async create(docs) {
    try {
      let result = await ordersModel.create(docs);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async get(filter, projection, options) {
    try {
      let result = await ordersModel
        .find(filter, projection, options)
        .populate("products.product");
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async getOne(conditions, projection) {
    try {
      let result = await ordersModel.findOne(conditions, projection);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await ordersModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
}

export class TokensMongoDao {
  async create(docs) {
    try {
      let result = await tokensModel.create(docs);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async updateOne(filter, update) {
    try {
      let result = await tokensModel.updateOne(filter, update);
      if (result.matchedCount) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
  async getOne(conditions, projection) {
    try {
      let result = await tokensModel.findOne(conditions, projection);
      return result;
    } catch (error) {
      logger.error(`${new Date().toLocaleString()} - ${error.message}`);
      return null;
    }
  }
}