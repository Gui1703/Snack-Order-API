const express = require("express");
const uuid = require("uuid");
const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

// MIDDLEWARE
const MiddlewareChecksMethodAndUrl = (request, response, next) => {
  const method = request.method;
  const url = request.url;

  console.log(method, "e", url);
  next();
};

const MiddlewareForId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) {
    response.status(404).json({ message: "Order not found" });
  }
  request.orderId = id;
  request.orderIndex = index;

  next();
};

// ROUTES

// Listar Pedidos
app.get("/orders", MiddlewareChecksMethodAndUrl, (request, response) => {
  return response.json({ orders });
});

// Criar Pedido
app.post("/orders", MiddlewareChecksMethodAndUrl, (request, response) => {
  const { order, clientName, price } = request.body;

  const status = "Em preparação";

  const client = { id: uuid.v4(), order, clientName, price, status };

  orders.push(client);

  return response.status(201).json({ client });
});

// Atualizar Pedido
app.put("/orders/:id", MiddlewareForId, MiddlewareChecksMethodAndUrl, (request, response) => {
    const { order, clientName, price } = request.body;
    const status = "Em preparação";

    const index = request.orderIndex;

    const id = request.orderId;

    const updateOrder = { id, order, clientName, price, status };

    orders[index] = updateOrder;

    return response.json({ updateOrder });
  }
);

// Deletar Pedido
app.delete("/orders/:id", MiddlewareForId, MiddlewareChecksMethodAndUrl, (request, response) => {
  const index = request.orderIndex;

  const id = request.orderId;

  orders.splice(index, 1);

  return response.status(204).json();
});

// Listar o pedido pelo id
app.get("/orders/:id", MiddlewareForId, MiddlewareChecksMethodAndUrl, (request, response) => {
    const id = request.orderId 
    const index = request.orderIndex 

    const { order, clientName, price } = request.body
    const status = "Em preparação";
  
    const updateOrder = { id, order, clientName, price, status };

    orders[index] = updateOrder;

    return response.json({ updateOrder });
  });

// PATCH do status
app.patch("/orders/:id", MiddlewareForId, MiddlewareChecksMethodAndUrl, (request, response) => {
    const id = request.orderId 
    const index = request.orderIndex 

    const { order, clientName, price } = request.body
    const status = "Pedido Pronto";
  
    const updateOrder = { id, order, clientName, price, status };

    orders[index] = updateOrder;

    return response.json({ updateOrder });
  });

// Servidor Node.js
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
