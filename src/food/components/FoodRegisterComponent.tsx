import { useState } from 'react';
import { MenuItem } from '../entities/MenuItem';
import { FoodService } from '../services/FoodServices';

function FoodRegisterComponent() {
  const [item, setItem] = useState<MenuItem>({
    id: 0,
    name: '',
    quantity: 0,
    desc: '',
    price: 0,
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: name === 'id' || name === 'quantity' || name === 'price' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await FoodService.CrearMenu(item);
      alert('Menú creado exitosamente');
      setItem({ id: 0, name: '', quantity: 0, desc: '', price: 0, image: '' });
    } catch (error) {
      console.error('Error al registrar el menú:', error);
    }
  };

  return (
    <div className="registerForm">
      <h2>Registrar Nuevo Menú</h2>
      <form onSubmit={handleSubmit}>
        <label>ID:</label>
        <input type="number" name="id" value={item.id} onChange={handleChange} required />
        <br />
        <label>Nombre:</label>
        <input type="text" name="name" value={item.name} onChange={handleChange} required />
        <br />
        <label>Cantidad:</label>
        <input type="number" name="quantity" value={item.quantity} onChange={handleChange} required />
        <br />
        <label>Descripción:</label>
        <textarea name="desc" value={item.desc} onChange={handleChange} required />
        <br />
        <label>Precio:</label>
        <input type="number" name="price" value={item.price} onChange={handleChange} required />
        <br />
        <label>Imagen (URL):</label>
        <input type="text" name="image" value={item.image} onChange={handleChange} />
        <br />
        <input type="submit" value="Registrar" />
      </form>
    </div>
  );
}

export default FoodRegisterComponent;
