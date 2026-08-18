import { useEffect, useState } from "react";

interface HealthResponse {
status: string;
}

function HealthCheck() {
const [status, setStatus] = useState<string>("Checking...");

useEffect(() => {
const checkBackendHealth = async () => {
try {
const response = await fetch("http://localhost:5000/api/health");

if (!response.ok) {
throw new Error("Backend health check failed");
}

const data: HealthResponse = await response.json();

setStatus(data.status);
} catch (error) {
setStatus("Backend unavailable");
console.error(error);
}
};

checkBackendHealth();
}, []);

return (
<div>
<h3>Backend Status:</h3>
<p>{status}</p>
</div>
);
}

export default HealthCheck;