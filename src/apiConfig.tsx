// Replace these with your actual username and password
const username = '12173e30ec556fe4a951';
const password = '2fbbd75fd60a8389b82719d2dbc37f1eb9ed226f3eb43cfa7d9240c72fd5+bfc89ad4-c17f-4fe9-82c2-918d29d59fe0';

// Encode credentials in base64
const base64Credentials = btoa(`${username}:${password}`);

// Construct the Basic Auth header
export const AUTH_HEADER = `Basic ${base64Credentials}`;
