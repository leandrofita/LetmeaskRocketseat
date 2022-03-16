import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../services/firebase";

export function Home() {
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }
    navigate("/rooms/new");
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    //método para buscar uma sala por ID no firebase
    const roomRef = ref(database);
    get(child(roomRef, `rooms/${roomCode}`))
      .then((room) => {
        if (!room.exists()) {
          alert("Room does not exists.");
          return;
        }
        if (room.val().endedAt) {
          alert("The room is already closed.");
          return;
        }
        navigate(`/rooms/${roomCode}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
          <img src={logoImg} alt="" />
          <button
            className="create-room"
            onClick={() => {
              handleCreateRoom();
            }}
          >
            <img src={googleIconImg} alt="Logo do Google"></img>
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(e) => {
                setRoomCode(e.target.value);
              }}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
