/**
 * Interceptor.js file is for mocking req and resp object.
 * While testing the controller, we need to make sure that the 
 * * req object contains all the desired req parameters
 * * body object contains all the desired body parameters
 * * resp object contains appropriate status code data required to be
 * * sent to the front-end
 * */

module.exports = {
    mockRequest: () => {
        const req = {}
        req.body = jest.fn().mockReturnValue(req),  // default empty {}
        req.params = jest.fn().mockReturnValue(req) // default empty {}
        return req;
    },

    mockResponse: () => {
        const res = {}
        res.status = jest.fn().mockReturnValue(res),
        res.send = jest.fn().mockReturnValue(res)
        return res;
    }
}