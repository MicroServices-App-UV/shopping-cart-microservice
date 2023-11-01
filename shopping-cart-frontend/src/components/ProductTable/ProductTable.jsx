import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CardActions,
  Stack,
  Container,
} from "@mui/material";

function ProductTable() {
 
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  

  useEffect(() => {
    fetchCartData();
    fetchTotalPrice();
  }, []);

  const fetchCartData = () => {
    fetch('http://127.0.0.1:8000/get-user-shopping-cart/1', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setCartData(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const removeFromCart = (order_id) => {
    // En este manejador de eventos, envía una solicitud DELETE a la API para eliminar el producto del carrito.
    fetch(`http://127.0.0.1:8000/remove-from-cart/${order_id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      // Actualiza los datos del carrito después de eliminar el producto
      fetchCartData();
      fetchTotalPrice(); 
    })
    .catch(error => {
      console.error('Error removing product:', error);
    });
  };


  const updateQuantity = (order_id, newQuantity) => {
   
    fetch(`http://127.0.0.1:8000/new-quantity-shopping-cart/${order_id}/${newQuantity}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },

    })
    .then(response => response.json())
    .then(data => {
      fetchCartData();
      fetchTotalPrice(); 
    })
    .catch(error => {
      console.error('Error updating product quantity:', error);
    });
    
  }

  const fetchTotalPrice = () => {
    fetch(`http://127.0.0.1:8000/total-shopping-cart/1`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setTotalPrice(data.total_price);
      console.log(data.totalPrice)
    })
    .catch(error => {
      console.error('Error fetching total price:', error);
    });
  };



  return (
    <Container maxWidth="md" spacing={3}>
      <Card sx={{ margin: "20px", padding: "20px" }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: "center" }}>
                    PRODUCTO
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    CANTIDAD
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>PRECIO</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartData.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell style={{ textAlign: "center" }}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ bgcolor: "#FBB400", color: "#fff" }}
                        onClick={() => {
                          if (row.count > 1) {
                            updateQuantity(row.order_id, row.count - 1)
                          };
                          }}
                      >
                        -
                      </Button>
                      {row.count}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ bgcolor: "#FBB400", color: "#fff" }}
                        onClick={() => updateQuantity(row.order_id, row.count + 1)}
                      >
                        +
                      </Button>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {row.price}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ bgcolor: "#FBB400", color: "#fff" }}
                        onClick={() => removeFromCart(row.order_id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Stack direction="row" spacing={2} sx={{ marginTop: "20px" }}>
              <Paper elevation={1} sx={{ marginLeft: "auto" }}>
                <Typography>Total: {totalPrice}</Typography>
              </Paper>
            </Stack>
          </TableContainer>
        </CardContent>
        <CardActions
          sx={{ justifyContent: "space-between", marginTop: "10px" }}
        >
          <Button variant="outlined" sx={{ bgcolor: "#FFA500", color: "#fff" }}>
            Volver
          </Button>

          <Button variant="outlined" sx={{ bgcolor: "#FFA500", color: "#fff" }}>
            realizar compra
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}

export default ProductTable;
