import "@styles/svgs/nav_profile.scss"

const Profile: React.FC<{ width?: number; height?: number; color?: string; border_color?: string }> = ({ width = 40, height = 40, color = "black", border_color = "black" }) => {
    return (
        <svg className="nav-profile-icon" height={height} width={width} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="9" r="3" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="10" stroke={border_color} strokeWidth="1.5"/>
            <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
};

export default Profile;