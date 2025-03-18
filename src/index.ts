import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient();

app.get("/contacts", async (c) => {
  try {
    const contacts = await prisma.contact.findMany();
    return c.json(contacts, 200);
  } catch (e) {
    return c.json({ error: "doesn't exists" }, 500);
  }
});

app.post("/contacts", async (c) => {
  try {
    const { name, phone,email } = await c.req.json();
    const contact = await prisma.contact.create({
      data: {
        name:name,
        phone:phone,
        email:email,
      },
    });
    return c.json(contact, 201);
  } catch (e) {
    
    return c.json({ error: "doesn't exists" }, 500);
  }
});

app.patch("/contacts/:id", async (c) => {
  try {
    const { id} =  c.req.param();
    const { name, phone, email } = await c.req.json();
    const contact = await prisma.contact.update({
      where: {
        id: id,
      },
      data: {
        name:name,
        phone:phone,
        email:email,
      },
    });
    return c.json(contact, 200);
  } catch (e) {
    return c.json({ error: "doesn't exists" }, 500);
  }
});

app.delete("/contacts/:id", async (c) => {
  try {
    const { id } =  c.req.param();
    const contact = await prisma.contact.delete({
      where: {
        id: id,
      },
    });
    return c.json(contact, 200);
  } catch (e) {
    return c.json({ error: "doesn't exists" }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
