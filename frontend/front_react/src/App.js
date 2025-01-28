import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]); // State para armazenar os itens
  const [newItem, setNewItem] = useState({ name: '', price: '' }) // State de criação
  const [editingItem, setEditingItem] = useState(null) // State de edição
  const [error, setError] = useState(null); // State de erros

  // Buscar os dados da API
  useEffect(() => {
    fetch('http://localhost:5000/items')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da API');
        }
        return response.json();
      })
      .then((data) => setItems(data)) // Armazena os dados no estado
      .catch((err) => setError(err.message)); // Trata erros
  }, []);

  const handleCreateItem = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/items/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao criar item');
        return response.json();
      })
      .then((item) => {
        setItems((prevItems) => [...prevItems, item]); // Atualiza a lista de itens
        setNewItem({ name: '', price: '' }); // Limpa o formulário
      })
      .catch((err) => setError(err.message));
  };

  const handleDeleteItem = (id) => {
    fetch(`http://localhost:5000/items/delete/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao deletar item');
        setItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Remove o item da lista
      })
      .catch((err) => setError(err.message));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/items/update/${editingItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao atualizar')
        return response.json();
      })
      .then((updatedItem) => {
        setItems((prevItems) => 
          prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
        setEditingItem(null);
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div>
      <h1>Itens do Banco de Dados</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreateItem}>
        <input
          type="text"
          placeholder="Nome do Item"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço do Item"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button type="submit">Adicionar Item</button>
      </form>

      {editingItem && (
        <form onSubmit={handleUpdateItem}>
          <input
            type="text"
            value={editingItem.name}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
          <input
            type="number"
            value={editingItem.price}
            onChange={(e) =>
              setEditingItem({ ...editingItem, price: e.target.value })
            }
          />
          <button type="submit">Salvar</button>
          <button onClick={() => setEditingItem(null)}>Cancelar</button>
        </form>
      )}

      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.id}{" - "}
              {item.name} - ${item.price} { }
              <button onClick={() => handleEditItem(item)}>Editar</button>
              <button onClick={() => handleDeleteItem(item.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum item encontrado.</p>
      )}
    </div>
  );
}

export default App;
