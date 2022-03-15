import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import {Link} from 'react-router-dom';
import { FormEvent, useState } from "react";

import "../styles/auth.scss";
import { Button } from "../components/Button";

import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { ref, set, push } from "firebase/database";

export function NewRoom() {

  const [newRoom, setNewRoom] = useState('');

  //o event aqui serve para prevenir o comportamento padrão do formulário de dar update na página.
  const handleCrateRoom = async (event: FormEvent) => {
    event.preventDefault();
    
    //trim remove os espaços a direita e à esquerda para verificar se o nome da sala não está vazio
    if(newRoom.trim() === ''){
      return;
    }
    //Método para salvar uma lista de salas no Firebase
    const roomsRef = ref(database, 'rooms');
    const newRoomsRef = push(roomsRef);
     set(newRoomsRef, {
      title: newRoom,
      authorId: user?.id
    })

  }

  

  const {user} = useAuth()

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p> Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCrateRoom}>
            <input type="text" placeholder="Nome da sala" onChange={(e)=> setNewRoom(e.target.value)} value={newRoom}/>
            <Button type="submit">Criar sala</Button>
            
          </form>
          <p>
              Quer entrar em uma sala existente? <Link to='/'>clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
