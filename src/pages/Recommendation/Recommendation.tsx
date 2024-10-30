import React, { useEffect, useState } from 'react';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import './Recommendation.css';

import Layout from '../../components/Layout/Layout';
import Divider from '../../components/Divider/Divider';

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
        pictures: ["https://engineering.case.edu/sites/default/files/styles/715x447/public/plane-take-off-feat.jpg?itok=jMjZMlWG"],
        price: {
            currencyCode: "EUR",
            amount: "50.00",
        },
        bookingLink: "https://example.com/louvre-booking",
    },
    {
        id: "3",
        name: "BLALBLABLA",
        shortDescription: "Enjoy a guided tour through the Louvre and discover iconic artworks like the Mona Lisa.",
        rating: "4.7",
        pictures: [""],
        price: {
            currencyCode: "EUR",
            amount: "50.00",
        },
        bookingLink: "https://example.com/louvre-booking",
    },
    {
        id: "4",
        name: "BLALBLABLA",
        shortDescription: "Enjoy a guided tour through the Louvre and discover iconic artworks like the Mona Lisa.",
        rating: "4.7",
        pictures: ["https://engineering.case.edu/sites/default/files/styles/715x447/public/plane-take-off-feat.jpg?itok=jMjZMlWG"],
        price: {
            currencyCode: "EUR",
            amount: "50.00",
        },
        bookingLink: "https://example.com/louvre-booking",
    },
    {
        id: "5",
        name: "BLALBLABLA",
        shortDescription: "Enjoy a guided tour through the Louvre and discover iconic artworks like the Mona Lisa.",
        rating: "4.7",
        pictures: ["https://engineering.case.edu/sites/default/files/styles/715x447/public/plane-take-off-feat.jpg?itok=jMjZMlWG"],
        price: {
            currencyCode: "EUR",
            amount: "50.00",
        },
        bookingLink: "https://example.com/louvre-booking",
    },
    {
        id: "6",
        name: "BLALBLABLA",
        shortDescription: "Enjoy a guided tour through the Louvre and discover iconic artworks like the Mona Lisa.",
        rating: "4.7",
        pictures: ["https://engineering.case.edu/sites/default/files/styles/715x447/public/plane-take-off-feat.jpg?itok=jMjZMlWG"],
        price: {
            currencyCode: "EUR",
            amount: "50.00",
        },
        bookingLink: "https://example.com/louvre-booking",
    },
];

const Recommendation: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const activitiesPerPage = 5;

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

    // Calculate indices for slicing the activities array
    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

    // Function to change pages
    const nextPage = () => {
        if (currentPage < Math.ceil(activities.length / activitiesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    return (
        <Layout>
            <Divider />
            <h1 className="title no-select">Recommendations For You</h1>
            <div className="activity-cards-container">
                {currentActivities.map((activity) => (
                    <ActivityCard
                        key={activity.id}
                        name={activity.name}
                        description={activity.shortDescription}
                        rating={activity.rating}
                        image={activity.pictures[0] ? activity.pictures[0] : "/images/travel.jpg"}
                        price={`${activity.price.amount} ${activity.price.currencyCode}`}
                        bookingLink={activity.bookingLink}
                    />
                ))}
            </div>
            <div className="pagination">
                <button
                    type="button"
                    onClick={prevPage}
                    className="pagination-button"
                    disabled={currentPage === 1}
                >
                    &#8592;
                </button>
                <button
                    type="button"
                    onClick={nextPage}
                    className="pagination-button"
                    disabled={currentPage === Math.ceil(activities.length / activitiesPerPage)}
                >
                    &#8594;
                </button>
            </div>

        </Layout>
    );
};

export default Recommendation;


