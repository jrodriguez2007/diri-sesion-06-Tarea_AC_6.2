import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { MenuItem } from "../entities/MenuItem";
import { FoodService } from '../services/FoodServices';
import LoggerService from '../../../src/auth/services/LoggerService';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

import { SaleItem } from '../entities/SaleItem';

interface FoodOrderComponentProps {
    item: MenuItem;
    onOrderSubmit: () => void;
}

function FoodOrderComponent({ item, onOrderSubmit }: FoodOrderComponentProps) {

    const [cantidad, setCantidad] = useState(1);
    const [cliente, setCliente] = useState("");
    const [numero, setNumero] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 
    const [showForm, setShowForm] = useState(true); 

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {

        setIsProcessing(true);
        setShowAlert(true);
        setShowForm(false);

        const cantidadRestante = item.quantity - cantidad;
        await FoodService.ActualizarStock(item.id, cantidadRestante);

        const currentSale: SaleItem = {
          idItem: item.id,
          quantity: cantidad,
          price: item.price,
          customer: cliente,
          telephone: numero,
          total: item.price * cantidad
        };

        // Simular el tiempo de procesamiento con un timeout
        setTimeout(async () => {
            await FoodService.RegistrarVenta(currentSale);
            setIsProcessing(false); // Desactivar el estado de "procesando"
            setShowAlert(false); // Ocultar la alerta
            onOrderSubmit(); // Volver al listado
        }, 2000);

      } catch (error) {
        LoggerService.error('Error al procesar el pedido: ' + error);
        setIsProcessing(false); // Desactivar el estado de "procesando" en caso de error
      }
    };  
    
    // Error para probar Boundary
    if (cantidad < 1) {
      throw new Error('La cantidad no puede ser menor a uno, y se ha ingresado ' + cantidad);
    }

    return (

          <div>

                {showAlert && (
                    <Alert variant="info" className="text-center">
                        <Spinner
                            animation="border"
                            role="status"
                            size="sm"
                            className="me-2"
                        >
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        Registrando la venta, por favor espere...
                    </Alert>
                )}

                {showForm && (
                  <Form  onSubmit={handleSubmit}>
                    <h2>Datos de la compra - {item.name}</h2>
                    <Form.Group className="mb-3">
                      <Form.Label>Cantidad:</Form.Label>
                      <Form.Control
                        type="number"
                        max={item.quantity}
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Cliente:</Form.Label>
                      <Form.Control
                        type="text"
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Número Telefónico:</Form.Label>
                      <Form.Control
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Grabar
                    </Button>
                    <Button variant="secondary" onClick={() => onOrderSubmit()}>
                      Cancelar
                    </Button>
                  </Form>
                )}
                

          </div>

    );
   }

export default FoodOrderComponent;