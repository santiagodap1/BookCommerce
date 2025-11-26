import './ApiInfo.css';

export function ApiInfo() {
    return (
        <div className="api-info-container">
            <div className="api-header">
                <h1>API Documentation</h1>
                <p>Explore the endpoints that power our application.</p>
            </div>

            <div className="api-details">
                <div className="endpoint-card">
                    <div>
                        <span className="method get">GET</span>
                        <span className="path">/api/books</span>
                    </div>
                    <p className="description">Retrieve a list of all available books in the catalog. Supports pagination and filtering.</p>
                </div>

                <div className="endpoint-card">
                    <div>
                        <span className="method get">GET</span>
                        <span className="path">/api/books/:id</span>
                    </div>
                    <p className="description">Fetch detailed information about a specific book by its unique identifier.</p>
                </div>

                <div className="endpoint-card">
                    <div>
                        <span className="method post">POST</span>
                        <span className="path">/api/orders</span>
                    </div>
                    <p className="description">Create a new order with the items in the user's cart. Requires authentication.</p>
                </div>
            </div>
        </div>
    );
}
