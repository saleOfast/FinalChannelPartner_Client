import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Select from 'react-select'; // Ensure you're using react-select
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';

const ManageOrgInfoScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [userInfo, setUserInfo] = useState({
        company_name: '',
        mobile: '',
        email: '',
        website: '',
        country_id: '',
        state_id: '',
        city_id: '',
        address: '',
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});

    // useEffect(() => {
    //     // Fetch countries
    //     const fetchCountries = async () => {
    //         const response = await axios.get(`${Baseurl}/countries`);
    //         const formattedCountries = response.data.map(item => ({
    //             value: item.country_id,
    //             label: item.country_name
    //         }));
    //         setCountries(formattedCountries);
    //     };

    //     fetchCountries();
    // }, []);

    const handleCountryChange = async (selectedOption) => {
        setUserInfo({ ...userInfo, country_id: selectedOption.value });
        
        // Fetch states based on selected country
        const response = await axios.get(`${Baseurl}/states/${selectedOption.value}`);
        const formattedStates = response.data.map(item => ({
            value: item.state_id,
            label: item.state_name
        }));
        setStates(formattedStates);
    };

    const handleStateChange = async (selectedOption) => {
        setUserInfo({ ...userInfo, state_id: selectedOption.value });

        // Fetch cities based on selected state
        const response = await axios.get(`${Baseurl}/cities/${selectedOption.value}`);
        const formattedCities = response.data.map(item => ({
            value: item.city_id,
            label: item.city_name
        }));
        setCities(formattedCities);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userInfo.company_name) newErrors.company_name = 'Company Name is required.';
        if (!userInfo.mobile) newErrors.mobile = 'Mobile is required.';
        if (!userInfo.email) newErrors.email = 'Email is required.';
        if (!userInfo.website) newErrors.website = 'Website is required.';
        if (!userInfo.country_id) newErrors.country_id = 'Country is required.';
        if (!userInfo.state_id) newErrors.state_id = 'State is required.';
        if (!userInfo.city_id) newErrors.city_id = 'City is required.';
        if (!userInfo.address) newErrors.address = 'Address is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Submit the form
            console.log(userInfo);
            toast.success('Form submitted successfully!');
        }
    };

    return (
        <>
            <div className={`main_Box ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">DESIGNATION MASTER</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href='/setting'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Designation Master</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content p-5">
                    <form onSubmit={handleSubmit}>
                        <div className="add_user_form">
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="company_name">Company Name*</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Company Name'
                                            name="company_name"
                                            id="company_name"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, company_name: e.target.value })}
                                            value={userInfo.company_name}
                                        />
                                        {errors.company_name && <span className="error">{errors.company_name}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="mobile">Mobile*</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Mobile Number'
                                            name="mobile"
                                            id="mobile"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })}
                                            value={userInfo.mobile}
                                        />
                                        {errors.mobile && <span className="error">{errors.mobile}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="email">Email*</label>
                                        <input
                                            type="email"
                                            placeholder='Enter Email'
                                            name="email"
                                            id="email"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                            value={userInfo.email}
                                        />
                                        {errors.email && <span className="error">{errors.email}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="website">Website*</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Website URL'
                                            name="website"
                                            id="website"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
                                            value={userInfo.website}
                                        />
                                        {errors.website && <span className="error">{errors.website}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="country">Country*</label>
                                        <Select
                                            id="country"
                                            value={countries.find(item => item.value === userInfo.country_id) || null}
                                            options={countries}
                                            onChange={handleCountryChange}
                                        />
                                        {errors.country_id && <span className="error">{errors.country_id}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="state">State*</label>
                                        <Select
                                            id="state"
                                            value={states.find(item => item.value === userInfo.state_id) || null}
                                            options={states}
                                            onChange={handleStateChange}
                                        />
                                        {errors.state_id && <span className="error">{errors.state_id}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="city">City*</label>
                                        <Select
                                            id="city"
                                            value={cities.find(item => item.value === userInfo.city_id) || null}
                                            options={cities}
                                            onChange={(e) => setUserInfo({ ...userInfo, city_id: e.value })}
                                        />
                                        {errors.city_id && <span className="error">{errors.city_id}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6">
                                    <div className="input_box">
                                        <label htmlFor="address">Address*</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Address'
                                            name="address"
                                            id="address"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                                            value={userInfo.address}
                                        />
                                        {errors.address && <span className="error">{errors.address}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-6 ">
                                    <button type="submit" className="btn btn-primary float-end">Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ManageOrgInfoScreen;
