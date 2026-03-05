import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export type CartItem = {
	productid: number;
	value: number;
}

export type CartContextType = [CartItem[], Dispatch<SetStateAction<CartItem[]>>];

// Provide a tuple: [cartItems, setCartItems]
export const CartContext = createContext<CartContextType | undefined>(undefined);