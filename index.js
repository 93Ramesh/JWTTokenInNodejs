const express = require("express");
const jwt = require("jsonwebtoken");
const http = require("http");
const secreteKey = "secrete_key";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const server = http.createServer(app);

app.get("/", (req, resp) => {
    resp.json({
        message: "a sample api"
    });
});

app.post("/login", (req, resp) => {
    const user = {
        id: 1,
        username: "Ramesh",
        email: "abc@gmail.com",
        roles: ["user"] // User role added to the user object
    };

    // Creating a JWT token for the user with a 300 second (5 minutes) expiration
    jwt.sign({ user }, secreteKey, { expiresIn: '300s' }, (err, token) => {
        if (err) {
            return resp.status(500).json({ error: "Error signing token" });
        }
        resp.json({
            token
        });
    });
});

app.post("/adminLogin", (req, resp) => {
    const user = {
        id: 2,
        username: "Admin",
        email: "admin@gmail.com",
        roles: ["admin"] // Admin role added to the admin object
    };

    // Creating a JWT token for the admin with a 300 second (5 minutes) expiration
    jwt.sign({ user }, secreteKey, { expiresIn: '300s' }, (err, token) => {
        if (err) {
            return resp.status(500).json({ error: "Error signing token" });
        }
        resp.json({
            token
        });
    });
});

app.post("/profile", verifyToken, (req, resp) => {
    // Middleware `verifyToken` verifies the JWT token from the request
    jwt.verify(req.token, secreteKey, (err, authData) => {
        if (err) {
            resp.send({ result: "invalid token" });
        } else {
            resp.json({
                message: "profile accessed",
                authData
            });
        }
    });
});

app.post("/admin", verifyToken, verifyRole("admin"), (req, resp) => {
    // Middleware `verifyToken` verifies the JWT token from the request
    // Middleware `verifyRole("admin")` checks if the user has the "admin" role
    jwt.verify(req.token, secreteKey, (err, authData) => {
        if (err) {
            resp.send({ result: "invalid token" });
        } else {
            resp.json({
                message: "admin accessed",
                authData
            });
        }
    });
});

function verifyToken(req, resp, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next(); // Proceed to the next middleware or route handler
    } else {
        resp.send({
            result: "token is not valid"
        });
    }
}

function verifyRole(role) {
    return (req, resp, next) => {
        jwt.verify(req.token, secreteKey, (err, authData) => {
            if (err) {
                resp.sendStatus(403); // Token verification failed
            } else if (!authData.user.roles.includes(role)) {
                resp.sendStatus(403); // User does not have the required role
            } else {
                next(); // Role is verified, proceed to the next middleware or route handler
            }
        });
    };
}

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





// const express = require("express");
// const jwt = require("jsonwebtoken");
// const app = express();
// const secreteKey = "secrete_key";

// app.use(express.json()); // Middleware to parse JSON bodies

// app.get("/", (req, resp) => {
//     resp.json({
//         message: "a sample api"
//     });
// });

// app.post("/login", (req, resp) => {
//     const user = {
//         id: 1,
//         username: "Ramesh",
//         email: "abc@gmail.com"
//     };

//     jwt.sign({ user }, secreteKey, { expiresIn: '300s' }, (err, token) => {
//         if (err) {
//             return resp.status(500).json({ error: "Error signing token" });
//         }
//         resp.json({
//             token
//         });
//     });
// });

// app.post("/profile",verifyToken,(req,resp)=>{
//     jwt.verify(req.token,secreteKey,(err,authData)=>{
//         if(err){
//             resp.send({result:"invalid token"})
//         }else{
//             resp.json({
//                 message:"profile accessed",
//                 authData
//             })
//         }
//     })

// })

// function verifyToken(req,resp,next){
//     const bearerHeader=req.headers['authorization'];
//     if(typeof bearerHeader!=='undefined'){
//         const bearer=bearerHeader.split(" ");
//         const token=bearer[1];
//         req.token=token;
//         next();

//     }else{
//         resp.send({
//             result:"token is not valid"
//         })
//     }

// }

// app.listen(5000, () => {
//     console.log("app is running on 5000 port");
// });

//-----------------------------------------------------------------------------------------------------------

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const app = express();
// const secreteKey = "secrete_key";

// app.use(express.json()); // Middleware to parse JSON bodies

// app.get("/", (req, resp) => {
//     resp.json({
//         message: "a sample api"
//     });
// });

// app.post("/login", (req, resp) => {
//     const user = {
//         id: 1,
//         username: "Ramesh",
//         email: "abc@gmail.com",
//         roles: ["user"] // Add roles to the user
//     };

//     jwt.sign({ user }, secreteKey, { expiresIn: '300s' }, (err, token) => {
//         if (err) {
//             return resp.status(500).json({ error: "Error signing token" });
//         }
//         resp.json({
//             token
//         });
//     });
// });

// app.post("/adminLogin", (req, resp) => {
//     const user = {
//         id: 2,
//         username: "Admin",
//         email: "admin@gmail.com",
//         roles: ["admin"] // Add roles to the admin
//     };

//     jwt.sign({ user }, secreteKey, { expiresIn: '300s' }, (err, token) => {
//         if (err) {
//             return resp.status(500).json({ error: "Error signing token" });
//         }
//         resp.json({
//             token
//         });
//     });
// });

// app.post("/profile", verifyToken, (req, resp) => {
//     jwt.verify(req.token, secreteKey, (err, authData) => {
//         if (err) {
//             resp.send({ result: "invalid token" });
//         } else {
//             resp.json({
//                 message: "profile accessed",
//                 authData
//             });
//         }
//     });
// });

// app.post("/admin", verifyToken, verifyRole("admin"), (req, resp) => {
//     jwt.verify(req.token, secreteKey, (err, authData) => {
//         if (err) {
//             resp.send({ result: "invalid token" });
//         } else {
//             resp.json({
//                 message: "admin accessed",
//                 authData
//             });
//         }
//     });
// });

// function verifyToken(req, resp, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(" ");
//         const token = bearer[1];
//         req.token = token;
//         next();
//     } else {
//         resp.send({
//             result: "token is not valid"
//         });
//     }
// }

// function verifyRole(role) {
//     return (req, resp, next) => {
//         jwt.verify(req.token, secreteKey, (err, authData) => {
//             if (err) {
//                 resp.sendStatus(403); // Token verification failed
//             } else if (!authData.user.roles.includes(role)) {
//                 resp.sendStatus(403); // User does not have the required role
//             } else {
//                 next(); // Role is verified, proceed to the next middleware or route handler
//             }
//         });
//     };
// }


// app.listen(5000, () => {
//     console.log("app is running on 5000 port");
// });


//--------------------------------------------------------------------------------------
