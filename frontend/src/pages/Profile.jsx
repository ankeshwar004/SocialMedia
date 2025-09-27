import React from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
	const { profileId } = useParams();
	return (
		<div className="p-4">Profile {profileId ? `- ${profileId}` : ""}</div>
	);
}

