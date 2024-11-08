export const filterByCategory = (products, setFilteredProducts) => (category) => {
    if (!setFilteredProducts || typeof setFilteredProducts !== 'function') {
        console.error('setFilteredProducts is not a function');
        return;
    }
    const filtered = products.filter(
        (product) => product.category === category
    );
    setFilteredProducts(filtered);
};

export const handleSearch = (products, setFilteredProducts) => (searchTerm) => {
    if (!setFilteredProducts || typeof setFilteredProducts !== 'function') {
        console.error('setFilteredProducts is not a function');
        return;
    }
    if (searchTerm) {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    } else {
        setFilteredProducts(products);
    }
};
