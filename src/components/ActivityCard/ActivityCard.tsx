// ActivityCard.tsx
import React from 'react';

interface ActivityCardProps {
    name: string;
    description: string;
    rating: string;
    image: string;
    price: string;
    bookingLink: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ name, description, rating, image, price, bookingLink }) => {
    return (
        <div className="activity-card">
            <img src={image} alt={name} className="activity-image" />
            <div className="activity-details"> 
                <h3>{name}</h3>
                <p>{description}</p>
                <p>Rating: {rating}</p>
                <p>Price: {price}</p>
                <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                    Book Now
                </a>
            </div>
        </div>
    );
};

export default ActivityCard;
