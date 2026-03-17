import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/authcontext';


const ProtectedRoute = ({children, allowedRoles}) =>{
    const {user,loading} = useAuth();

    if (loading) return <p>Loading...</p>


    if(!user) return <Navigate to= '/' />
    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to = '/tickets' replace/>
    }
    return children;
};
export default ProtectedRoute;