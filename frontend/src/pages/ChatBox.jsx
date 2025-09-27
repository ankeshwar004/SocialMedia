import React from "react";
import { useParams } from "react-router-dom";

export default function ChatBox() {
	const { userId } = useParams();
	return (
		<div className="p-4">Chat with: {userId}</div>
	);
}

