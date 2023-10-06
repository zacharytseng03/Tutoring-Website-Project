import express from 'express'
import cors from 'cors'
import { router as apiRouter } from "./api/Routes";

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use("/api", apiRouter);

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
