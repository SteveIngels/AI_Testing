class EnrollmentMiddleware {
    constructor() {
        // Constructor logic here
    }

    handleRequest(req, res, next) {
        // Logic to handle HTTP requests for enrollment
        // Example SKU transformation logic
        if (req.body.sku) {
            req.body.sku = this.transformSKU(req.body.sku);
        }
        next(); // Pass the request to the next middleware
    }

    transformSKU(sku) {
        // Transform SKU logic here
        return sku.toUpperCase(); // Example transformation
    }
}

module.exports = EnrollmentMiddleware;