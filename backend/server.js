import { Hono } from "hono";


const app  = new Hono();
app.get('/', (c) => c.text('dziala'));


export default app;