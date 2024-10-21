var ShoppingCartImplementation = /** @class */ (function () {
    function ShoppingCartImplementation() {
        this.items = [];
      
    }

    ShoppingCartImplementation.prototype.addItem = function (item) {
        this.items.push(item);
    };
    ShoppingCartImplementation.prototype.removeItem = function (id, quantity) {
        this.items = this.items.filter(function (item) { return item.id !== id; });
    };
    ShoppingCartImplementation.prototype.updateQuantity = function (id, quantity) {
        var filteritem = this.items.filter(function (item) { return item.id === id; });
        if (filteritem.length > 0) {
            filteritem[0].quantity = quantity;
        }
    };
    ShoppingCartImplementation.prototype.calculateTotal = function () {
        var subtotal = 0;
        var discount = 0;
        var appliedDiscounts = [];
        this.items.forEach(function (item) {
            subtotal += item.price * item.quantity;
        });
        discount = subtotal * 0.1;
        appliedDiscounts.push("hggf");
        var shipping = 50;
        var total = subtotal - discount + shipping;
        return {
            subtotal: subtotal,
            discount: discount,
            shipping: shipping,
            total: total,
            appliedDiscounts: appliedDiscounts
        };
    };
    return ShoppingCartImplementation;
}());
var cart = new ShoppingCartImplementation();
cart.addItem({
    id: 1,
    name: "Laptop",
    price: 999.99,
    quantity: 1,
    category: "electronics",
    discountable: true
});
var total = cart.calculateTotal();
console.log(total);
