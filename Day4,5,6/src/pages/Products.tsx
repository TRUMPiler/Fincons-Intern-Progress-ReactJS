import { useEffect, useState} from "react";
import axios from "axios";
import { ShowProducts } from "../components/ShowProducts";
type Product = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
};

export function Products() {
    const [rendering,setRendering]=useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
     const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery,setSearchQuery]=useState<string>("");
    const [debounceQuery,setDebounceQuery]=useState<string>("");
    const itemsPerPage = 6;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const [totalPages,SetTotalPages]=useState<number>(1);
    useEffect(() => {
        if(rendering) return;
        const fetchProducts = async () => 
            {
                
                try{
                    setRendering(true);
                    const response = await axios.get("https://dummyjson.com/products");
                    const fetchAllProducts=response.data.products;
                    setAllProducts(fetchAllProducts);
                    const selectedItems=fetchAllProducts.slice(startIndex, startIndex + itemsPerPage);
                    setProducts(selectedItems);
                    console.log(await response.data.products);
                    SetTotalPages(Math.ceil(fetchAllProducts.length / itemsPerPage));
                }
                catch(Exception)
                {
                    console.log(Exception);
                }
                finally{
                    setTimeout(()=>{setRendering(false);},500)    
                    
                }
            };

        fetchProducts();
       
    }, []);
    useEffect(()=>{
        (async()=>{
            setRendering(true);
            if(searchQuery==="")
            {
                 const selectedItems =await allProducts.slice(startIndex, startIndex + itemsPerPage);
                await setProducts(selectedItems);
                setRendering(false);
                
            }
            else
            {
                const FilteredProducts=allProducts.filter(t=>{return t.title.toLowerCase().includes(searchQuery.toLowerCase())});
                console.log(searchQuery);
                setProducts(FilteredProducts.slice(startIndex, startIndex + itemsPerPage));
                  setRendering(false);
            }
        })();
    },[currentPage])
    
    useEffect(()=>{
        setRendering(true);
        const FilteredProducts=allProducts.filter(t=>{return t.title.toLowerCase().includes(searchQuery.toLowerCase())});
        console.log(searchQuery);
        setCurrentPage(1);
        setProducts(FilteredProducts.slice(startIndex, startIndex + itemsPerPage));
        setRendering(false);
      
    },[searchQuery])
   
    useEffect(()=>{
        const timeout=setTimeout(()=>setSearchQuery(debounceQuery),500);
        return ()=>{
            clearTimeout(timeout);
        }
    },[debounceQuery])
    

    return (
        <>
        
            {(rendering)?(<></>):(
                <>
               
                <ShowProducts products={products} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} debounceQuery={debounceQuery} setDebounceQuery={setDebounceQuery} items={itemsPerPage}/>
                </>
            )}
        </>
    )
}
