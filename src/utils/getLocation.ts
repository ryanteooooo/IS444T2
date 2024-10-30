// src/utils/getLocation.ts
import axios from 'axios';

export const getLocation = async () => {
    try {
        const response = await axios.get('/api/get-location'); // Replace with OutSystems endpoint
        return response.data;
    } catch (error) {
        console.error("Error fetching location from backend: ", error);
        return null;
    }
};
