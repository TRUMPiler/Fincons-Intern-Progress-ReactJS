import { Card } from "primereact/card";
import { Button } from "primereact/button";
import {useContext, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router";

import { CartContext } from "../components/Cart";

type Product = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
};
export interface ProductsProps 
{
    products: Product[];
    setCurrentPage: Dispatch<SetStateAction<number>>;
    currentPage: number;
    totalPages:number;
    debounceQuery:string;
    setDebounceQuery:Dispatch<SetStateAction<string>>;
    items:number;
}
export const ShowProducts = ({ products, setCurrentPage, currentPage,totalPages,debounceQuery,setDebounceQuery,items }: ProductsProps) => {
    const navigate = useNavigate();
    const cartContext = useContext(CartContext);
    const cartItems = Array.isArray(cartContext) ? cartContext[0] : [];
    const setCartItems = Array.isArray(cartContext) ? cartContext[1] : undefined;
    

    return (
    <div className="bg-linear-to-r from-white to-gray-300"> 
    <div className="flex justify-end items-end p-6 ">
        <input type="text" id="search" value={debounceQuery} placeholder="Search Product Name here" className="border border-gray-900 p-1 w-auto rounded-xl sm:p-3 hover:scale-105 transition-all cursor-pointer bg-white" onChange={(e)=>{setDebounceQuery(e.target.value)}}/>
    </div>
    <div className=" w-full grid grid-cols-1 gap-8 justify-content-center  max-w-full p-6 text-sm lg:grid-cols-3 ">
        
        {products.map(product => (
            <Card key={product.id} title={product.title} subTitle={product.category}>
                <div className="flex justify-center">
                    <img
                        alt={product.title}
                        src={product.images && product.images.length ? product.images[0] : ''}
                        className="w-40 h-auto"
                    />
                </div>
                <p className="m-0">
                    {product.description}
                </p>
                <br/>
                <p className="m-0 ">
                   $ {product.price}
                </p>
                <div className="flex gap-2 mt-9">
                    <Button label="See Details" onClick={() => navigate(`/products/${product.id}`)} className="border-2 black" />
                    {(() => {
                        const existing = cartItems.find(ci => ci.productid === product.id);
                        const qty = existing ? existing.value : 0;
                        if (qty === 0) {
                            return (
                                <Button label="Add to Cart" severity="secondary" icon="pi pi-shopping-cart" style={{ marginLeft: '0.5em' }} onClick={() => {
                                    if (!setCartItems) return;
                                    setCartItems(prev => {
                                        const found = prev.find(p => p.productid === product.id);
                                        if (found) return prev.map(p => p.productid === product.id ? { ...p, value: p.value + 1 } : p);
                                        return [...prev, { productid: product.id, value: 1 }];
                                    });
                                }} />
                            );
                        }

                        return (
                            <div className="flex items-center gap-2 ml-2">
                                <Button label="-" onClick={() => {
                                    if (!setCartItems) return;
                                    setCartItems(prev => {
                                        return prev.reduce((acc, it) => {
                                            if (it.productid === product.id) {
                                                const newVal = it.value - 1;
                                                if (newVal > 0) acc.push({ ...it, value: newVal });
                                              
                                            } else acc.push(it);
                                            return acc;
                                        }, [] as typeof prev);
                                    });
                                }} />
                                <div className="px-3">{qty}</div>
                                <Button label="+" onClick={() => {
                                    if (!setCartItems) return;
                                    setCartItems(prev => prev.map(p => p.productid === product.id ? { ...p, value: p.value + 1 } : p));
                                }} />
                            </div>
                        );
                    })()}
                </div>
            </Card>
        ))}
       
    </div>
     <div className="flex gap-4 p-3">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="bg-black p-3 rounded-xl text-white text-lg disabled:hidden">
                Prev
            </button>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={(currentPage>=totalPages||products.length<items)} className="bg-black p-3 rounded-xl text-white text-lg disabled:hidden">
                Next
            </button>
        </div>
    </div>
    );
}