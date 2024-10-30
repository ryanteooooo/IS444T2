// ActivityCard.tsx
import React from 'react';
import './ActivityCard.css'; // Assuming you have a CSS file for styling

interface ActivityCardProps {
    name: string;
    description: string;
    rating: string;
    image: string;
    price: string;
    bookingLink: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
    name,
    description,
    rating,
    image,
    price,
    bookingLink,
}) => {
    return (
        <div className='activity-card'>
            <img src={image} alt={name} className='activity-image' />
            <div className='activity-content'>
                <h3 className='activity-title'>{name}</h3>
                <p className='activity-description'>{description}</p>
                <div className='activity-info'>
                    <p className='activity-price'>{price}</p>
                    <a href={bookingLink} target='_blank' rel='noopener noreferrer' className='activity-link'>
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
