export class CartDto {
  constructor(cartData) {
    this._id = cartData._id;
    this.alias = cartData.alias;
    this.products = cartData.products;
    this.amount = cartData.products.reduce((acc, curr) => {
      return acc + curr.quantity * curr.productId.price;
    }, 0);
    this.totalItems = cartData.products.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);
  }
}