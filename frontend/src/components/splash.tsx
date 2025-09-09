'use client';

import * as React from 'react';
import './splash.css';

const Splash: React.FC<{ loading: boolean }> = ({ loading }) => {
    return (
        <div
            className={`splash-overlay ${!loading ? 'splash-overlay--hidden' : ''}`}
        />
    );
};

export default Splash;
