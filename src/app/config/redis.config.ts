import { createClient } from "redis";

const client = createClient({
  username: "default",
  password: "ZdXuiCxXQ5vtYuRIODlILGOvV9EiiSHR",
  socket: {
    host: "redis-17805.crce175.eu-north-1-1.ec2.redns.redis-cloud.com",
    port: 17805,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

await client.set("foo", "bar");
const result = await client.get("foo");
console.log(result); // >>> bar
