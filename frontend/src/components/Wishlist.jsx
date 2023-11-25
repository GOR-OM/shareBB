import React, { useEffect, useState } from 'react';
import axios from 'axios';
// const { configDotenv } = require('dotenv');
import ErrorPage from './ErrorPage';
import '../style/Wishlist.css';
import Stock from './Stock';
import { toast } from 'react-toastify';
import Loader from './Loader';
// require('dotenv').config()
const Wishlist = () => {
    const [share, setShare] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        'auth-token': token,
    };
    const handledelfav = async (e) => {
        try {
            const res = await axios.post("https://bearbull-qpng.onrender.com/del-fav", {
                company: e,
            }, { headers });
            const data = res.status;
            if (data === 200) {
                setShare(share.filter((item) => item !== e));
                toast.success("Deleted from Favourites");
            }
        } catch (err) {
            if (err.response) {
                console.log(err.response.status);
                console.log(err.message);
                console.log(err.response.headers);
                console.log(err.response.data);
            }
        }
    };
    useEffect(() => {
        const getWishlistData = async () => {
            try {
                const res = await axios.get("https://bearbull-qpng.onrender.com/getuser", { headers });
                console.log(res.data.favourites);
                const favoriteCompanies = res.data.favourites;
                const allCompaniesData = await axios.get("https://bearbull-qpng.onrender.com/getdata");
                const shareData = favoriteCompanies.map((companyName) => {
                    const filteredData = allCompaniesData.data.filter(item => item.Name === companyName);
                    return filteredData[0];
                });
                console.log(shareData);
                setShare(shareData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching wishlist data', error);
                setError(true);
                setLoading(false);
            }
        };

        getWishlistData();
    }, [share]);

    if (loading) {
        return <div>
            <Loader/>
        </div>;
    }

    if (error) {
        return <ErrorPage />;
    }

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h2>Your Wishlist</h2>
            </div>
            <div className="row m-5">
                {share && share.map((item, index) => (
                    item ? (
                        <>
                            <Stock
                                key={index}
                                name={item.Ticker}
                                lastClose={item.LastClose}
                                lastChange={item.LastChange}
                            />
                            <div className="col-12 text-right">
                                <button className='btn btn-primary' onClick={()=>handledelfav(item.Name)}>
                                    remove-fav
                                </button>
                            </div>
                        </>
                    ) : null
                ))}
            </div>
        </div>
    );
};

export { Wishlist };