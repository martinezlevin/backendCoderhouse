export class CartDto {
  constructor(cartData) {
    this._id = cartData._id;
    this.alias = cartData.alias;
    this.products = cartData.products.map((el) => {
      return {
        product: el.product,
        quantity: el.quantity,
        subtotal: el.quantity * el.product.price,
      };
    });
    this.amount = cartData.products.reduce((acc, curr) => {
      return acc + curr.quantity * curr.product.price;
    }, 0);
    this.totalItems = cartData.products.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);
  }
}