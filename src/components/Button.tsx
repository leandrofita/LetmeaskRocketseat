import { ButtonHTMLAttributes } from "react";
import '../styles/button.scss';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}
//utilizando o ButtonHTMLAttributes para passar para o componente botão todas as propriedades que um botão HTML possui.

export function Button({isOutlined = false, ...props }: ButtonProps) {
    //o spread operator está redistribuindo todas as props recebidas para o componente abaixo
    return (
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props}/>
    )
};
