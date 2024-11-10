import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext'; // Import useAuth from AuthContext
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
    const { latestCurrencyChanged, setLatestCurrencyChanged, accountID } = useAuth(); // Get latestCurrencyChanged from AuthContext
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const activitiesPerPage = 5;

    // Function to fetch the coordinates based on the currency
    const fetchCoordinates = async (currency: string) => {
        try {
            const response = await axios.get(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/GeographyAPI/GetSingleGeography?Currency=${currency}`);
            const { North: north, West: west, South: south, East: east } = response.data;
            return { north, west, south, east };
        } catch (error) {
            console.error('Error fetching geography data:', error);
            return null;
        }
    };

    // Function to fetch the activities based on coordinates
    const fetchActivities = async (north: string, west: string, south: string, east: string) => {
        try {
            const response = await axios.get(`https://personal-6hjam0f0.outsystemscloud.com/AutoExchangeCurrencyLocker/rest/AmadeusActivities/ActivitiesNew?north=${north}&west=${west}&south=${south}&east=${east}`);
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
            console.error('Error fetching activities:', error);
        }
    };

    useEffect(() => {
        // Function to fetch the latest currency from API if not already set in context
        const fetchLatestCurrency = async (accountId: string) => {
            try {
                const response = await axios.get(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/RateAPI/GetIndividualRateLock?AccountId=${accountId}`);
                const latestTransaction = response.data[response.data.length - 1]; // Get the last entry
                if (latestTransaction && latestTransaction.Currency) {
                    setLatestCurrencyChanged(latestTransaction.Currency); // Update AuthContext with latest currency
                }
            } catch (error) {
                console.error('Error fetching latest currency:', error);
            }
        };

        const loadActivities = async () => {
            // If latestCurrencyChanged is null, fetch from the API using the accountID
            if (!latestCurrencyChanged && accountID) {
                await fetchLatestCurrency(accountID); // Fetch the latest currency if not available
            }

            if (latestCurrencyChanged) {
                const coordinates = await fetchCoordinates(latestCurrencyChanged);
                if (coordinates) {
                    const { north, west, south, east } = coordinates;
                    await fetchActivities(north, west, south, east);
                }
            } else {
                console.warn("No selected currency, skipping activities load.");
            }
        };

        loadActivities();
    }, [latestCurrencyChanged, setLatestCurrencyChanged, accountID]); // Now `fetchLatestCurrency` is inside `useEffect`, so it's not needed in the dependency array

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
