import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axiosClient from './axios-client';
import { useStateContext } from './contexts/ContextProvider';

export default function Register() {
    const { token, setToken, setUser } = useStateContext();
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', password: '', cin: '', telephone: '', quartier: '',
    });

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div></div>
    );
}
const handleChange = (event) => {
    setFormData((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value,
    }));
};

const nextStep = () => setStep((prevState) => prevState + 1);
const prevStep = () => setStep((prevState) => prevState - 1);
/*************  ✨ Smart Paste 📚  *************/
/*******  be4f8d33-76a6-44e1-8a1f-45dc62e9feb7  *******/
const handleSubmit = (event) => {
    event.preventDefault();
    nextStep();
};

const handleFormSubmit = (event) => {
    event.preventDefault();
    nextStep();
};


/*************  ✨ Smart Paste 📚  *************/
/*******  33aee643-56ac-44bf-af6d-fe08f01a414d  *******/
const onSubmit = (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);

        axiosClient.post('/register', formData)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.access_token);
            })
            .catch(err => {
                setLoading(false);
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };