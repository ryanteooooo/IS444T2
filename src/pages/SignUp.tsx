import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

// components
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';

const SignUp = (): React.JSX.Element => { 
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const { setAccountID, setUserName, setUserEmail, setUserPhone } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/UserAPI/CreateUser', formData);

            if (response.data && response.data.AccountId) {
                setAccountID(response.data.AccountId.toString());
                setUserName(response.data.Name);
                setUserEmail(response.data.Email);
                setUserPhone(response.data.Phone); // Assuming `Phone` is returned in the response
                navigate('/home');
            } else {
                alert('Sign-up failed');
            }
        } catch (error) {
            console.error('Sign-up error:', error);
            alert('An error occurred');
        }
    };

    return (
        <div className='flex flex-v-center flex-h-center h-full'>
            <div className='bg' />
            <div className='text'>
                <h1 className='text-shadow'>Join Us!</h1>
                <p className='text-shadow'>Please create an account to continue.</p>

                <form method='post' action='/' className='form' noValidate onSubmit={handleSubmit}>
                    <div className='form-line'>
                        <div className='label-line'>
                            <label htmlFor='name' className='text-shadow' style={{ color: 'white' }}>
                                Name
                            </label>
                        </div>
                        <Input
                            required
                            tabIndex={0}
                            name='name'
                            type='text'
                            placeholder='Please enter your name'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-line'>
                        <div className='label-line'>
                            <label htmlFor='email' className='text-shadow' style={{ color: 'white' }}>
                                Email
                            </label>
                        </div>
                        <Input
                            required
                            tabIndex={0}
                            name='email'
                            type='email'
                            placeholder='Please enter your email'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-line'>
                        <div className='label-line'>
                            <label htmlFor='password' className='text-shadow' style={{ color: 'white' }}>
                                Password
                            </label>
                        </div>
                        <Input
                            required
                            tabIndex={0}
                            name='password'
                            type='password'
                            placeholder='Please enter your password'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-line'>
                        <div className='label-line'>
                            <label htmlFor='phone' className='text-shadow' style={{ color: 'white' }}>
                                Phone
                            </label>
                        </div>
                        <Input
                            required
                            tabIndex={0}
                            name='phone'
                            type='tel'
                            placeholder='Please enter your phone number'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-line'>
                        <Button type='submit' text='Sign Up' tabIndex={0} />
                    </div>
                </form>

                <div className='links'>
                    <a href='/' className='text-shadow'>
                        Already have an account? Sign in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
