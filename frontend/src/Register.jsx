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