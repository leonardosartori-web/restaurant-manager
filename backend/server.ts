// @ts-nocheck
import {app, server} from "./app";
import {connect} from "./database";

app.use( (req,res,next) => {
    console.log("------------------------------------------------")
    console.log("New request for: "+req.url );
    console.log("Method: "+req.method);
    next();
});

connect(() => {
    server.listen(8080, () => console.log("HTTP Server started on port 8080"));
})