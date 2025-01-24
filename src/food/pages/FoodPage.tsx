import React, { useEffect } from 'react';
import { ChangeEvent, useState } from 'react';
import { FoodService } from '../services/FoodServices';
import { MenuItem } from '../entities/MenuItem';
import FoodsComponent from '../components/FoodsComponent';
import FoodOrderComponent from '../components/FoodOrderComponent';
import FoodListComponent from '../components/FoodListComponent';
import ErrorBoundary from '../../ui/Componentes/ErrorBoundaryComponent';
import LoggerService from '../../../src/auth/services/LoggerService';
import { Button, Container, Row, Col, Alert, Spinner  } from 'react-bootstrap';

function FoodPage() {

    const textoGlobal = import.meta.env.VITE_EJEMPLO;

    const [isChooseFoodPage, setIsChooseFoodPage] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isLoadingMenu, setIsLoadingMenu] = useState(false); // Estado para mostrar el mensaje de carga
  
    useEffect(() => {
      const fetchMenu = async () => {
          try {
              setIsLoadingMenu(true); // Mostrar la alerta de carga
              setTimeout(async () => {
                  const menu = await FoodService.ObtenerMenu();
                  setMenuItems(menu);
                  setIsLoadingMenu(false); // Ocultar la alerta después de cargar
              }, 1000); // Tiempo simulado de carga
          } catch (error) {
              LoggerService.error('Error al cargar el menú: ' + error);
              setIsLoadingMenu(false); // Ocultar la alerta incluso si ocurre un error
          }
      };

      fetchMenu();
  }, []);    

  const handleOrderSubmit = async () => {
      const menu = await FoodService.ObtenerMenu();
      setMenuItems(menu);
      setSelectedItem(null); // Volver al listado
  };    

    return (
      <Container fluid className="py-4">
        <Row className="mb-4 text-center">
          <Col>
            <h1 className="display-4 text-success">FoodPage</h1>
            <h2 className="text-muted">{textoGlobal}</h2>
          </Col>
        </Row>
  
        <Row className="mb-3 justify-content-center">
          <Col xs="auto">
            <Button
              variant={isChooseFoodPage ? 'warning' : 'primary'}
              onClick={() => setIsChooseFoodPage(!isChooseFoodPage)}
            >
              {isChooseFoodPage ? 'Disponibilidad' : 'Pedir Comida'}
            </Button>
          </Col>
        </Row>
  
        <Row className="text-center">
          <Col>
            <h3 className="fw-bold">Comida Rápida Online</h3>
          </Col>
        </Row>
  

        {!isChooseFoodPage ? (
            <>
                <Row className="mb-3">
                    <Col>
                        <h4 className="text-light">Menús</h4>
                    </Col>
                </Row>


                {isLoadingMenu && (
                  <Row className="justify-content-center mb-4">
                      <Col xs="auto">
                          <Alert variant="info" className="text-center">
                              <Spinner
                                  animation="border"
                                  role="status"
                                  size="sm"
                                  className="me-2"
                              >
                                  <span className="visually-hidden">Cargando...</span>
                              </Spinner>
                              Cargando el menú, por favor espere...
                          </Alert>
                      </Col>
                  </Row>
                )}

                <Row>
                    <Col>
                        <FoodListComponent menuItems={menuItems} />
                    </Col>
                </Row>
            </>
        ) : selectedItem ? (
            <ErrorBoundary fallback={<div className="text-danger">¡Algo salió mal!</div>}>
                <FoodOrderComponent item={selectedItem} onOrderSubmit={handleOrderSubmit} />
            </ErrorBoundary>
        ) : (
            <FoodsComponent
                foodItems={menuItems}
                onSelectItem={(item) => setSelectedItem(item)}
            />
        )}

      </Container>
    );
}
export default FoodPage;
