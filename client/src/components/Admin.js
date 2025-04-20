import React from 'react';
import './Admin.css';

const Admin = () => {
    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <div className="admin-content">
                <p>Welcome to the admin dashboard. This area is restricted to admin users only.</p>
                {/* Add your admin-specific components and functionality here */}
            </div>
        </div>
    );
};

export default Admin; 