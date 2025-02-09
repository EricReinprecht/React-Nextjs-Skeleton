"use client"

import withAuth from "@hoc/withAuth";

const Profile: React.FC = () => {
    return <div>Welcome to your dashboard!</div>;
};

export default withAuth(Profile);