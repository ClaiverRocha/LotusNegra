import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { FaUser, FaSignOutAlt, FaShoppingCart, FaFilePdf, FaTrash } from "react-icons/fa";

import Camisa1 from "./assets/Camisa1.png";
import Camisa2 from "./assets/Camisa2.png";
import Camisa3 from "./assets/Camisa3.png";

const products = [
    { id: 1, name: "Modelo 1", price: 69.99, image: Camisa1 },
    { id: 2, name: "Modelo 2", price: 69.99, image: Camisa2 },
    { id: 3, name: "Modelo 3", price: 69.99, image: Camisa3 },
];

export default function App() {
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleAuth = async () => {
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            alert("Erro: " + error.message);
        }
    };

    const handleLogout = () => signOut(auth);

    const addToCart = (product) => {
        const quantity = Math.max(1, parseInt(quantities[product.id]) || 1);

        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === product.id);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            } else {
                return [...prev, { ...product, quantity }];
            }
        });

        setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateCartQuantity = (productId, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Orçamento", 10, 10);
        let y = 20;
        cart.forEach((item) => {
            doc.text(
                `${item.name} - ${item.quantity} x R$${item.price.toFixed(
                    2
                )} = R$${(item.quantity * item.price).toFixed(2)}`,
                10,
                y
            );
            y += 10;
        });
        const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
        doc.text(`Total: R$${total.toFixed(2)}`, 10, y);
        doc.save("orcamento.pdf");
    };

    if (!user) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #cceaff, #e0f7ff)",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: "700px",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                        backgroundColor: "#f8fbff",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            background: "linear-gradient(to bottom, #56ccf2, #2f80ed)",
                            color: "white",
                            padding: "40px 30px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            position: "relative",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                            />
                            <strong style={{ fontSize: "14px" }}>GESTOR</strong>
                        </div>

                        <h2 style={{ fontSize: "28px", marginTop: "40px", fontWeight: "600" }}>
                            {isRegistering ? "Cadastrar" : "Inscrever-se"}
                        </h2>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "linear-gradient(to right, #a1e1fa, #6dbfff)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "absolute",
                                bottom: "30px",
                                left: "30px",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsRegistering(!isRegistering)}
                        >
                            <span style={{ fontSize: "20px", color: "#fff" }}>➔</span>
                        </div>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#f8fbff",
                            padding: "40px 30px",
                            position: "relative",
                        }}
                    >
                        <button
                            onClick={() => window.close()}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "20px",
                                background: "none",
                                border: "none",
                                fontSize: "20px",
                                color: "#2f80ed",
                                cursor: "pointer",
                            }}
                            title="Fechar"
                        >
                            ×
                        </button>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ fontSize: "13px", color: "#2f80ed", fontWeight: "600" }}>
                                USUÁRIO
                            </label>
                            <input
                                placeholder="Digite sua ID, e-mail ou cpf"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 0",
                                    border: "none",
                                    borderBottom: "1px solid #2f80ed",
                                    backgroundColor: "transparent",
                                    color: "#333",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ fontSize: "13px", color: "#2f80ed", fontWeight: "600" }}>
                                SENHA
                            </label>
                            <input
                                type="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 0",
                                    border: "none",
                                    borderBottom: "1px solid #2f80ed",
                                    backgroundColor: "transparent",
                                    color: "#333",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                            <p style={{ fontSize: "12px", marginTop: "6px", color: "#2f80ed" }}>
                                Para alterar a senha <a href="#">clique aqui!</a>
                            </p>
                        </div>

                        <button
                            onClick={handleAuth}
                            style={{
                                background: "#2f80ed",
                                color: "white",
                                padding: "10px",
                                width: "100%",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                fontSize: "14px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            ENTRAR
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Parte do return com o catálogo permanece igual
    return (/* ...mesma estrutura da loja... */);
}