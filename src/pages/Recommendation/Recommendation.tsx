import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
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
    const { accountID, latestCurrencyChanged } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const activitiesPerPage = 5;

    // Function to fetch all available activities if no exchange history
    const fetchAllActivities = useCallback(async () => {
        try {
            const response = await axios.get(
                'https://personal-6hjam0f0.outsystemscloud.com/AutoExchangeCurrencyLocker/rest/AmadeusActivities/GetAllActivitiesNew'
            );
            
            const activityData = response.data.LocalActivitiesResponse;
    
            if (Array.isArray(activityData)) {
                const allActivities = activityData.map((activity: any) => ({
                    id: activity.Id,
                    name: activity.Name,
                    description: activity.Description,
                    pictures: activity.Pictures,
                    price: activity.Price,
                    bookingLink: activity.BookingLink,
                }));
                setActivities(allActivities);
                console.log('Fetched all activities:', allActivities);
            } else {
                console.warn('Expected array in activity data, got:', activityData);
            }
        } catch (error) {
            console.error('Error fetching all activities:', error);
        }
    }, []);
    

    // Function to fetch user-specific activities based on exchange history and coordinates
    const fetchUserSpecificActivities = useCallback(async () => {
        try {
            if (accountID) {
                // Fetch user coordinates to check if the user has exchanged currency
                const coordinatesResponse = await axios.get(
                    `https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/UserAPI/GetSingleUserCoordinates?AccountId=${accountID}`
                );

                if (coordinatesResponse.data.Errors) {
                    // If error occurs (500 Internal Server Error), user has not exchanged currency
                    console.warn('User has not exchanged currency, fetching all activities.');
                    await fetchAllActivities();
                } else {
                    // If coordinates exist, user has exchanged currency, fetch activities based on location
                    const dynamicActivitiesResponse = await axios.get(
                        `https://personal-6hjam0f0.outsystemscloud.com/DynamicActivities/rest/DynamicActivitiesPage/DynamicActivitiesComposite?AccountId=${accountID}`
                    );

                    if (dynamicActivitiesResponse.data && dynamicActivitiesResponse.data.data.length > 0) {
                        const userSpecificActivities = dynamicActivitiesResponse.data.data.map((activity: any) => ({
                            id: activity.id,
                            name: activity.name,
                            description: activity.shortDescription,
                            pictures: activity.pictures,
                            price: activity.price,
                            bookingLink: activity.bookingLink,
                        }));
                        setActivities(userSpecificActivities);
                        console.log('Fetched user-specific activities:', userSpecificActivities);
                    } else {
                        console.warn('No specific activities found for the user, fetching all activities.');
                        await fetchAllActivities();
                    }
                }
            } else {
                console.warn('Account ID is not available.');
            }
        } catch (error) {
            console.error('Error fetching user-specific activities:', error);
            await fetchAllActivities();
        }
    }, [accountID, fetchAllActivities]);

    useEffect(() => {
        // Fetch user-specific or all activities on component load
        const loadActivities = async () => {
            if (accountID) {
                await fetchUserSpecificActivities();
            } else {
                console.warn('No account ID found, unable to load activities.');
            }
        };

        loadActivities();
    }, [accountID, fetchUserSpecificActivities]);

    // Watch for changes in latestCurrencyChanged and refetch activities
    useEffect(() => {
        // If the latest currency changes, re-fetch the activities
        const loadActivities = async () => {
            if (latestCurrencyChanged && accountID) {
                await fetchUserSpecificActivities();
            }
        };
        loadActivities();
    }, [latestCurrencyChanged, accountID, fetchUserSpecificActivities]);

    // Pagination logic
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
