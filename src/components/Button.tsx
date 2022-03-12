import { useState } from "react";

export function Button() {
    const [counter, setCounter] = useState(0)

    function increment() {
        setCounter(counter + 1); // O counter não é alterado, somente tem o seu valor alterado
        console.log(counter)
    }
    return (
        <button onClick={increment}>{counter}</button>
    )
};
