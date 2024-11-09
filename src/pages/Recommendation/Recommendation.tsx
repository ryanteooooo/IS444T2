import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import './Recommendation.css';
import Actions from '../../components/Actions/Actions';
import Layout from '../../components/Layout/Layout';
import Divider from '../../components/Divider/Divider';

interface Activity {
    id: string;
    name: string;
    description: string;
    pictures: string[];
    price?: {
        amount?: string;
        currencyCode?: string;
    };
    bookingLink?: string;
}

const Recommendation: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const activitiesPerPage = 5;

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('https://personal-6hjam0f0.outsystemscloud.com/AutoExchangeCurrencyLocker/rest/AmadeusActivities/ActivitiesNew');

                const fetchedActivities = response.data.data.map((activity: any) => ({
                    id: activity.id,
                    name: activity.name,
                    description: activity.description,
                    pictures: activity.pictures,
                    price: activity.price,
                    bookingLink: activity.bookingLink,
                }));

                setActivities(fetchedActivities);
            } catch (error) {
                console.error('Error fetching activities: ', error);
            }
        };

        fetchActivities();
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

            <Actions />

            <Divider />
            
            <h1 className="title no-select">Recommendations For You</h1>
            <div className="activity-cards-container">
                {currentActivities.map((activity) => (
                    <ActivityCard
                        key={activity.id}
                        name={activity.name}
                        description={activity.description}
                        image={activity.pictures[0] ? activity.pictures[0] : "/images/travel.jpg"}
                        price={activity.price?.amount ? `${activity.price.amount} ${activity.price.currencyCode}` : 'N/A'}
                        bookingLink={activity.bookingLink || '#'}
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
