import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DealsCategory.css';

// Define the type for each attraction product
interface AttractionProduct {
    id: string;
    name: string;
    shortDescription: string;
    representativePrice: {
        chargeAmount: number;
        currency: string;
    };
    primaryPhoto?: {
        url: string;
    };
}

// Define the props type for DealsCategory
interface DealsCategoryProps {
    category: string;
}

const DealsCategory = ({ category }: DealsCategoryProps): React.JSX.Element => {
    const [products, setProducts] = useState<AttractionProduct[]>([]);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const options = {
                    method: 'GET',
                    url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels', // Replace with the actual endpoint URL
                    params: {
                        category: 'attractions', // Adjust if needed for your specific endpoint
                    },
                    headers: {
                        'X-RapidAPI-Key': '3f9dc5d3c3msh3c2cf2ac3f08446p163c6fjsnaed44bd9148a',
                        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
                    },
                };

                const response = await axios.request(options);
                setProducts(response.data.data.products || []); // Adjust based on the actual structure
            } catch (error) {
                console.error(`Error fetching ${category} deals:`, error);
            }
        };

        fetchDeals();
    }, [category]);

    return (
        <div className="deals-category">
            <h3>{category} Deals</h3>
            <div className="deals-vertical">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="deal-item">
                            {product.primaryPhoto && (
                                <img src={product.primaryPhoto.url} alt={product.name} />
                            )}
                            <h4>{product.name}</h4>
                            <p>{product.shortDescription}</p>
                            <p>
                                Price: {product.representativePrice.currency}{' '}
                                {product.representativePrice.chargeAmount}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Loading {category} deals...</p>
                )}
            </div>
        </div>
    );
};

export default DealsCategory;
