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
    getItemsByCategory(): Record<string, CartItem[]>;
}

class ShoppingCartImplementation implements ShoppingCart {
    items: CartItem[] = [];
    private discountRules: DiscountRule[] = [
        { category: "electronics", minimumAmount: 1000, percentage: 15, stackable: false },
        { category: "books", minimumAmount: 50, percentage: 10, stackable: true },
        { minimumAmount: 500, percentage: 5, stackable: true }
    ];

    private validateQuantity(quantity: number): boolean {
        return quantity > 0 && Number.isInteger(quantity);
    }

    private validatePrice(price: number): boolean {
        return price >= 0;
    }

    addItem(item: CartItem): void {
        if (!this.validateQuantity(item.quantity)) {
            throw new Error("Invalid quantity");
        }
        if (!this.validatePrice(item.price)) {
            throw new Error("Invalid price");
        }

        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
            console.log(`Updated quantity for ${existingItem.name} to ${existingItem.quantity}`);
        } else {
            this.items.push({ ...item });
            console.log(`Added ${item.name} to cart`);
        }
    }

    removeItem(id: number, quantity?: number): void {
        console.log(`Attempting to remove item with ID: ${id}`);
        const itemIndex = this.items.findIndex(item => item.id === id);

        if (itemIndex === -1) {
            console.log(`Item with ID ${id} not available`);
            return;
        }

        const item = this.items[itemIndex];
        if (quantity && quantity < item.quantity) {
            item.quantity -= quantity;
            console.log(`Reduced quantity of item ${item.name} to ${item.quantity}`);
        } else {
            this.items.splice(itemIndex, 1);
            console.log(`Item ${item.name} removed from cart.`);
        }

        console.log("Updated cart:", this.items);
    }

    updateQuantity(id: number, quantity: number): void {
        if (!this.validateQuantity(quantity)) {
            throw new Error("Invalid quantity");
        }
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            console.log(`Updated ${item.name} quantity to ${quantity}`);
        } else {
            console.log(`Item with ID ${id} not available`);
        }
        console.log("Updated cart:", this.items);
    }

    calculateTotal(): {
        subtotal: number;
        discount: number;
        shipping: number;
        total: number;
        appliedDiscounts: string[];
    } {
        const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const appliedDiscounts: string[] = [];
        let totalDiscount = 0;

        const categoryTotals = this.getItemsByCategory();
        for (const rule of this.discountRules) {
            if (rule.category) {
                const categoryItems = categoryTotals[rule.category] || [];
                const categoryTotal = categoryItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                if (categoryTotal >= (rule.minimumAmount || 0)) {
                    const discount = categoryTotal * (rule.percentage / 100);
                    if (rule.stackable) {
                        totalDiscount += discount;
                        appliedDiscounts.push(`${rule.percentage}% off ${rule.category} items (-$${discount.toFixed(2)})`);
                    } else if (discount > totalDiscount) {
                        totalDiscount = discount;
                        appliedDiscounts.length = 0;
                        appliedDiscounts.push(`${rule.percentage}% off ${rule.category} items (-$${discount.toFixed(2)})`);
                    }
                }
            }
        }

        const totalWeight = this.items.reduce((sum, item) => sum + (item.weightInKg || 0) * item.quantity, 0);
        const shipping = Math.max(50, totalWeight * 10); 

        const total = subtotal - totalDiscount + shipping;
        return {
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(totalDiscount.toFixed(2)),
            shipping: Number(shipping.toFixed(2)),
            total: Number(total.toFixed(2)),
            appliedDiscounts
        };
    }

    getItemsByCategory(): Record<string, CartItem[]> {
        return this.items.reduce((acc, item) => {
            (acc[item.category] ||= []).push(item);
            return acc;
        }, {} as Record<string, CartItem[]>);
    }
}

try {
    const cart = new ShoppingCartImplementation();
    cart.addItem({
        id: 1,
        name: "Laptop",
        price: 999.99,
        quantity: 1,
        category: "electronics",
        discountable: true,
        weightInKg: 2.5
    });
    cart.addItem({
        id: 2,
        name: "Programming Books Bundle",
        price: 79.99,
        quantity: 1,
        category: "books",
        discountable: true,
        weightInKg: 1.5
    });

    console.log("\nCart Contents:");
    console.log(cart.items);

    console.log("\nOrder Summary:");
    console.log(cart.calculateTotal());

    console.log("\nItems by Category:");
    console.log(cart.getItemsByCategory());

    cart.removeItem(1);

    console.log("\nUpdated Cart:");
    console.log(cart.items);
} catch (error) {
    if (error instanceof Error) {
        console.error("Error:", error.message);
    }
}
