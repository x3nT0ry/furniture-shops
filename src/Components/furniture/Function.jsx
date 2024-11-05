export const filterByCategory = (products, setFilteredProducts) => (category) => {
    const filtered = products.filter(
        (product) => product.category === category
    );
    setFilteredProducts(filtered);
};
export const handleSearch = (products, setFilteredProducts) => (searchTerm) => {
    if (searchTerm) {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    } else {
        setFilteredProducts(products); 
    }
};


