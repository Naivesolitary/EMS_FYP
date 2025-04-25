// hooks/useLogout.js
import { useAuth } from '../context/AuthContext';
import useAxiosPrivate from './useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const { logout } = useAuth();
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosPrivate.post('/api/auth/logout', {}, { withCredentials: true });
            logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return handleLogout;
};

export default useLogout;
