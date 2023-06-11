import React from 'react';
import logoWhite from '../logo/logoWhite.png';

export const Footer = () => {
    return (
        <div>
            <footer className="flex footer items-center p-4 bg-neutral text-neutral-content justify-between">
                <img className="footerLogo w-1/6" src={logoWhite} alt="header logo" />
                <p>Created by Ajmal Zahir @ Technigo 2023</p>
            </footer>
        </div>
    );
};