export default class ChatApi {
    static baseUrl = "http://localhost:8001";

    static async query_request(query) {
        try {
            if (!query || query.trim() === "") {
                return {
                    status: 400,
                    message: "Please enter a valid query"
                };
            }

            const cleanQuery = query.trim();
            console.log("Sending query:", cleanQuery); // Debug log
            
            const encodedQuery = encodeURIComponent(cleanQuery);
            const url = `${this.baseUrl}/query/${encodedQuery}`;
            console.log("Request URL:", url); // Debug log
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log("Response status:", response.status); // Debug log
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Response error:", errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log("Response data:", data); // Debug log
            return data;
        } catch (error) {
            console.error("Query request error:", error);
            return {
                status: 500,
                message: "Sorry! I'm having trouble connecting to the server. Please check if the backend is running and try again.",
                error: error.message
            };
        }
    }

    static async direct_request(klass) {
        try {
            if (!klass || klass.trim() === "") {
                return {
                    status: 400,
                    message: "Invalid class parameter"
                };
            }

            const encodedClass = encodeURIComponent(klass.trim());
            const response = await fetch(`${this.baseUrl}/direct/${encodedClass}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Direct request error:", error);
            return {
                status: 500,
                message: "Sorry! Something doesn't feel right. Please try again later.",
                error: error.message
            };
        }
    }
}