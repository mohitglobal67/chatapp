const JWt = require('jsonwebtoken')

const userAuth = async (req, res, next) => {


    // for header authorization
    // const authHeader = req.headers.authorization;


    // for  bearear token
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        res.status(500).send({
            seccess: false,
            message: "Auth is required"
        })
    }

    if (!authHeader || !authHeader.startsWith('Bearer')) {

        next('Auth Failed')
    }

    const token = authHeader.split(" ")[1]



    try {
        const payload = JWt.verify(token, process.env.JWT_SECRET)

        req.user = { userId: payload.userId }
        next();

    } catch (error) {

        next('Auth Failed')
    }
}

export default userAuth;



