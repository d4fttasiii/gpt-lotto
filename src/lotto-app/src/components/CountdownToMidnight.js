// src/components/CountdownToMidnight.js
import React, { useState, useEffect } from 'react';

const CountdownToMidnight = () => {
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const now = new Date();
            const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
            const diff = midnight - now;

            const hours = Math.floor(diff / 1000 / 60 / 60);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        const intervalId = setInterval(() => {
            calculateTimeRemaining();
        }, 1000);

        calculateTimeRemaining();

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="text-center  rounded-lg w-72 mx-auto shadow-lg">
            <h2 className="bg-gray-800 text-left p-4 text-xl text-white font-bold">Time until next draw</h2>
            <div className="bg-gray-600 text-2xl p-4 font-semibold text-white">
                {timeRemaining}
            </div>

        </div>
    );
};

export default CountdownToMidnight;
