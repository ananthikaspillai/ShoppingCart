interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: "electronics" | "clothing" | "books" | "food";
    discountable: boolean;
    weightInKg?: number;
}
interface DiscountRule {
    category?: "electronics" | "clothing" | "books" | "food";
    minimumAmount?: number;
    percentage: number;
    stackable: boolean;
}
interface ShoppingCart {
    items: CartItem[];
    addItem(item: CartItem): void;
    removeItem(id: number, quantity?: number): void;
    updateQuantity(id: number, quantity: number): void;
    calculateTotal(): {
        subtotal: number;
        discount: number;
        shipping: number;
        total: number;
        appliedDiscounts: string[];
    };
    // getItemsByCategory(): Record<string, CartItem[]>;
}


class ShoppingCartImplementation implements ShoppingCart {
    items: CartItem[] = [];

    addItem(item: CartItem): void {
        this.items.push(item)
        console.log(item);

    }

    removeItem(id: number, quantity?: number): void {
        console.log(`Attempting to remove item with ID: ${id}`);
        const item = this.items.find(item => item.id === id);
        
        if (!item) {
            console.log(`Item with ID ${id} not found.`);
            return;
        }

        if (quantity && quantity < item.quantity) {
            item.quantity -= quantity;
            console.log(`Reduced quantity of item ${item.name} to ${item.quantity}`);
        } else {
            this.items = this.items.filter(item => item.id !== id);
            console.log(`Item ${item.name} removed from cart.`);
        }

        console.log("Updated cart:", this.items);
    }
    updateQuantity(id: number, quantity: number): void {
        const filteritem = this.items.filter(item => item.id === id);
        if (filteritem.length > 0) {
            filteritem[0].quantity = quantity;
        }

    }
    calculateTotal(): {
        subtotal: number;
        discount: number;
        shipping: number;
        total: number;
        appliedDiscounts: string[];
    } {
        let subtotal = 0;
        let discount = 0;
        const appliedDiscounts: string[] = []

        this.items.forEach(item => {
            subtotal += item.price * item.quantity
        })
        discount = subtotal * 0.1;
        appliedDiscounts.push('discount added')

        const shipping = 50;
        const total = subtotal - discount + shipping
        return {
            subtotal,
            discount,
            shipping,
            total,
            appliedDiscounts
        }
    }

    // getItemsByCategory(): Record<string, CartItem[]> {

    // }

}

const cart = new ShoppingCartImplementation()
cart.addItem({
    id: 1,
    name: "Laptop",
    price: 999.99,
    quantity: 1,
    category: "electronics",
    discountable: true
})
cart.addItem({
    id: 2,
    name: "Wings",
    price: 100,
    quantity: 2,
    category: "books",
    discountable: true
})


const total = cart.calculateTotal();
console.log(total);
console.log('initial cart',cart.items);

cart.removeItem(1)