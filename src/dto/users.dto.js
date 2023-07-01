export class CurrentUserDto {
  constructor(userData) {
    this._id = userData._id;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.fullName = `${userData.firstName} ${userData.lastName}`;
    this.email = userData.email;
    this.birthday = userData.birthday;
    this.role = userData.role;
    this.cart = userData.cart;
    this.lastOrder = userData.lastOrder;
  }
}