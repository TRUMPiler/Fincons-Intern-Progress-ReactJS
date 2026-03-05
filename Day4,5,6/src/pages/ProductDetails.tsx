import axios from "axios";
import { Button } from "primereact/button";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { CartContext } from "../components/Cart";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Rating } from "primereact/rating";
import SadRating from "../assets/image.png";
import HappyRating from "../assets/1f601.png";
import CancelRating from "../assets/x.png";
export const ProductDetails = () => {

    type Review = { reviewerName?: string; rating?: number; comment?: string };
    const toast = useRef(null);
    const cartContext = useContext(CartContext);
    const cartItems = Array.isArray(cartContext) ? cartContext[0] : [];
    const setCartItems = Array.isArray(cartContext) ? cartContext[1] : undefined;
    const [visible, setVisible] = useState<boolean>(false);

    type Product = {
        id: number;
        title: string;
        description: string;
        category?: string;
        price?: number;
        images?: string[];
        brand?: string;
        availabilityStatus?: string;
        dimensions?: { width?: number; height?: number; depth?: number };
        discountPercentage?: number;
        meta?: { barcode?: string; qrCode?: string; createdAt?: string; updatedAt?: string };
        minimumOrderQuantity?: number;
        rating?: number;
        returnPolicy?: string;
        reviews?: Review[];
        shippingInformation?: string;
        sku?: string;
        stock?: number;
        tags?: string[];
        thumbnail?: string;
        warrantyInformation?: string;
        weight?: number;
    };
    const shows = () => {
        toast.current.show({ severity: 'error', summary: 'Sorry😥', detail: 'Buy Now is not Avilable right now' });
    };

    const [comment, SetCommentReview] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const resp = await axios.get(`https://dummyjson.com/products/${id}`);
                setProduct(resp.data);
                console.log(resp.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    const dims = product.dimensions;

    return (
        <div className="min-h-screen bg-white p-6">
            <Dialog header="Add Review" visible={visible} onHide={() => { if (!visible) return; setVisible(false); }} draggable={false} resizable={false} style={{ width: '50vw' }}>
                <form className="flex flex-col max-w-full gap-7 p-6">
                    <div className="mb-0">
                        <FloatLabel>
                            <InputText id="comment" value={comment} className="w-full p-6" onChange={(e) => { SetCommentReview(e.target.value) }} />
                            <label htmlFor="comment">Comment</label>
                        </FloatLabel>
                    </div>
                    <div className="mb-0">
                        <FloatLabel>
                            <InputText id="user" value={user} className="w-full p-6" onChange={(e) => { setUser(e.target.value) }} />
                            <label htmlFor="user">Name of the user</label>
                        </FloatLabel>

                    </div>
                    <div className="mb-0 p-2">

                        <label>Rating</label>
                        <Rating value={rating} onChange={(e) => setRating(e.value ?? 0)}
                            cancelIcon={<img src={CancelRating} alt="custom-cancel-image" width="25px" height="25px" />}
                            onIcon={<img src={HappyRating} alt="custom-image-active" width="25px" height="25px" />}
                            offIcon={<img src={SadRating} alt="custom-image" width="25px" height="25px" />}
                        />

                    </div>
                    <div className="mb-0">
                        <button className="bg-blue-400 p-3 border text-white border-white" type="button" onClick={() => {
                            const addReview:Review={comment:comment,reviewerName:user,rating:rating};
                            if (product) {
                                const updatedReviews = product.reviews ? [...product.reviews, addReview] : [addReview];
                                setProduct({ ...product, reviews: updatedReviews });
                                setVisible(false);
                                toast.current?.show({ severity: 'success', summary: 'Review Added', detail: 'Your review has been added successfully!' });
                            }
                        }}>Give Rating</button>
                    </div>
                </form>
            </Dialog>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 flex flex-col items-center">
                    <Toast ref={toast} />
                    <img
                        alt={product.title}
                        src={(product.images && product.images.length > 0) ? product.images[0] : product.thumbnail}
                        className="w-full max-w-md h-auto object-contain border rounded"
                    />
                    <div className="mt-4 flex gap-2">
                        {(product.images || []).slice(0, 4).map((img, i) => (
                            <img key={i} src={img} alt={`${product.title}-${i}`} className="w-16 h-16 object-cover border rounded" />
                        ))}
                    </div>
                    <p className="text-sm text-center text-gray-500 mt-2">dimensions: {dims?.width ?? '—'} x {dims?.height ?? '—'} x {dims?.depth ?? '—'} cm</p>
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                    <h1 className="text-4xl font-bold">{product.title}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-semibold">${product.price?.toFixed(2)}</span>
                        {product.discountPercentage ? (
                            <span className="text-sm text-green-600">{product.discountPercentage}% off</span>
                        ) : null}
                        <span className="text-sm text-gray-500">Rating: {product.rating ?? 'N/A'}</span>
                        <span className={`text-sm ${product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock && product.stock > 0 ? 'In stock' : 'Out of stock'}
                        </span>
                    </div>

                    <div className="text-sm text-gray-700">
                        <strong>Brand:</strong> {product.brand || '—'}
                    </div>

                    <div className="text-sm text-gray-700">
                        <strong>Category:</strong> {product.category || '—'}
                    </div>

                    <div className="text-base">
                        <strong>Description:</strong>
                        <p className="mt-2 text-gray-800">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            {/* <p><strong>SKU:</strong> {product.sku || '—'}</p> */}
                            <p><strong>Barcode:</strong> {product.meta?.barcode || '—'}</p>
                            <p><strong>Minimum Order Qty:</strong> {product.minimumOrderQuantity ?? '—'}</p>
                            <p><strong>Shipping:</strong> {product.shippingInformation || '—'}</p>
                        </div>
                        <div>
                            <p><strong>Weight:</strong> {product.weight ? `${product.weight} g` : '—'}</p>
                            <p><strong>Warranty:</strong> {product.warrantyInformation || '—'}</p>
                            <p><strong>Return Policy:</strong> {product.returnPolicy || '—'}</p>
                            {/* <p><strong>Updated:</strong> {product.meta?.updatedAt ? new Date(product.meta.updatedAt).toLocaleString() : '—'}</p> */}
                        </div>
                    </div>

                    <div className="mt-2">
                        <strong>Dimensions:</strong>
                        <div className="text-sm text-gray-700">
                            Width: {dims?.width ?? '—'} cm · Height: {dims?.height ?? '—'} cm · Depth: {dims?.depth ?? '—'} cm
                        </div>
                    </div>

                    <div className="mt-4">
                        <strong>Tags:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(product.tags || []).map((t, i) => (
                                <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">{t}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <span>
                            <h2 className="text-xl font-semibold">Reviews</h2>
                            <Button label="Add Comment" onClick={() => { setVisible(true); }} />
                        </span>
                        <div className="mt-2 space-y-3">
                            {(product.reviews && product.reviews.length > 0) ? (
                                product.reviews.map((r, idx) => (
                                    <div key={idx} className="border p-3 rounded">
                                        <div className="flex justify-between">
                                            <div className="font-medium">{r.reviewerName || 'Anonymous'}</div>
                                            <div className="text-sm text-gray-600">Rating: {r.rating ?? '—'}</div>
                                        </div>
                                        {r.comment ? <p className="mt-2 text-sm">{r.comment}</p> : null}
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No reviews yet</div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition-all" onClick={shows}>Buy Now</button>
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
                        {product.meta?.qrCode && (
                            <a href={product.meta.qrCode} target="_blank" rel="noreferrer" className="ml-4 text-sm text-blue-600 underline">Open QR</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}