// import React from 'react'
// import Layout from '../components/Layout/Layout';
// import Divider from '../components/Divider/Divider';


// const Recommendation = (): React.JSX.Element => {
//     return (
//         <Layout>
//             <Divider />

//             <h1 className="title no-select">Recommendation</h1>

//             <Divider />



//             <Divider />
//         </Layout>
//     );
// }

// export default Recommendation

// Recommendation.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityCard from '../components/ActivityCard/ActivityCard';

import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

interface Activity {
    id: string;
    name: string;
    shortDescription: string;
    rating: string;
    pictures: string[];
    price: {
        currencyCode: string;
        amount: string;
    };
    bookingLink: string;
}

const dummyData: Activity[] = [
    {
        id: "1",
        name: "Skip-the-line tickets to the Prado Museum",
        shortDescription: "Book your tickets for the Prado Museum in Madrid, discover masterpieces by Velázquez, Goya, and more.",
        rating: "4.5",
        pictures: ["https://images.musement.com/cover/0001/07/prado-museum-tickets_header-6456.jpeg?w=500"],
        price: {
            currencyCode: "EUR",
            amount: "16.00",
        },
        bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=2WxbgL36",
    },
    {
        id: "2",
        name: "Guided Tour of the Louvre Museum",
        shortDescription: "Enjoy a guided tour through the Louvre and discover iconic artworks like the Mona Lisa.",
        rating: "4.7",
        pictures: ["https://images.example.com/louvre-tour.jpeg"],
        price: {
            currencyCode: "EUR",
            amount: "50.00",
        },
        bookingLink: "https://example.com/louvre-booking",
    },
];

const Recommendation: React.FC = () => {

    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        // const fetchActivities = async () => {
        //     try {
        //         const response = await axios.get('/api/get-activities'); // Replace with actual endpoint
        //         setActivities(response.data.data);
        //     } catch (error) {
        //         console.error("Error fetching activities: ", error);
        //     }
        // };

        // fetchActivities();

        // for dummy data
        setActivities(dummyData);
    }, []);

    return (
        <Layout>
            <Divider />
            <h1 className="title no-select">Activity Recommendations</h1>
            <div className="activity-cards-container">
                {activities.map((activity) => (
                    <ActivityCard
                        key={activity.id}
                        name={activity.name}
                        description={activity.shortDescription}
                        rating={activity.rating}
                        image={activity.pictures[0]}
                        price={`${activity.price.amount} ${activity.price.currencyCode}`}
                        bookingLink={activity.bookingLink}
                    />
                ))}
            </div>
        </Layout>
    );
};

export default Recommendation;
