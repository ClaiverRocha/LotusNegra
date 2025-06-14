import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { auth } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { FaUser, FaSignOutAlt, FaShoppingCart, FaFilePdf } from "react-icons/fa";

// Imagens
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
        const quantity = parseInt(quantities[product.id]) || 1;
        setCart((prev) => [...prev, { ...product, quantity }]);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Orcamento", 10, 10);
        let y = 20;
        cart.forEach((item) => {
            doc.text(
                `${item.name} - ${item.quantity} x R$${item.price.toFixed(2)} = R$${(
                    item.quantity * item.price
                ).toFixed(2)}`,
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
                style={{ backgroundColor: "white", minHeight: "100vh", color: "black" }}
                className="flex items-center justify-center p-4"
            >
                <div className="bg-zinc-100 p-8 rounded-xl w-full max-w-sm shadow-lg space-y-4">
                    <h1 className="text-2xl font-semibold text-center flex items-center gap-2 justify-center">
                        <FaUser /> {isRegistering ? "Cadastro" : "Login"}
                    </h1>
                    <input
                        placeholder="Email"
                        className="w-full p-2 bg-white rounded border border-gray-300 text-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="w-full p-2 bg-white rounded border border-gray-300 text-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleAuth}
                        className="w-full bg-green-400 text-black py-2 rounded font-bold"
                    >
                        {isRegistering ? "Cadastrar" : "Entrar"}
                    </button>
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="w-full border border-green-400 text-green-400 py-2 rounded"
                    >
                        {isRegistering ? "Já tem conta? Entrar" : "Criar conta"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{ backgroundColor: "white", minHeight: "100vh", color: "black", position: "relative" }}
            className="p-6"
        >
            {/* Botão sair fixado no topo direito */}
            <button
                onClick={handleLogout}
                style={{
                    position: "fixed",
                    top: "16px",
                    right: "16px",
                    backgroundColor: "transparent",
                    border: "2px solid black",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "black",
                    zIndex: 1000,
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "black";
                    e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "black";
                }}
            >
                <FaSignOutAlt /> Sair
            </button>

            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-widest uppercase">L◉tus Negra</h1>
                <p className="text-gray-700 ">Camisas Oversized personalizadas</p>
            </header>

            <h2 className="text-2xl font-bold mb-8">Catálogo</h2>

            {/* Linha com 3 produtos lado a lado */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "nowrap",
                }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            backgroundColor: "#f3f4f6",
                            padding: "12px",
                            borderRadius: "12px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            flex: "0 0 30%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: "270px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginBottom: "12px",
                            }}
                        />
                        <h3
                            style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: "6px" }}
                        >
                            {product.name}
                        </h3>
                        <p
                            style={{
                                color: "#16a34a",
                                fontWeight: "500",
                                fontSize: "0.9rem",
                                marginBottom: "8px",
                            }}
                        >
                            R${product.price.toFixed(2)}
                        </p>
                        <input
                            type="number"
                            min="1"
                            value={quantities[product.id] || 1}
                            onChange={(e) =>
                                setQuantities({ ...quantities, [product.id]: e.target.value })
                            }
                            style={{
                                width: "100%",
                                padding: "6px",
                                fontSize: "0.8rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                marginBottom: "8px",
                                textAlign: "center",
                            }}
                        />
                        <button
                            onClick={() => addToCart(product)}
                            style={{
                                width: "100%",
                                backgroundColor: "#1E90FF",
                                color: "black",
                                padding: "8px",
                                fontWeight: "700",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                cursor: "pointer",
                                border: "none",
                            }}
                        >
                            Adicionar
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaShoppingCart /> Sacola
                </h2>
                {cart.length === 0 ? (
                    <p className="text-gray-500">Nenhum item adicionado.</p>
                ) : (
                    <ul className="list-disc ml-6 space-y-1">
                        {cart.map((item, index) => (
                            <li key={index}>
                                {item.quantity}x {item.name} —{" "}
                                <span className="text-green-600">
                                    R${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {cart.length > 0 && (
                    <button
                        onClick={generatePDF}
                        className="mt-6 flex items-center gap-2 bg-green-400 text-black px-4 py-2 rounded font-bold"
                    >
                        <FaFilePdf /> Baixar Orçamento em PDF
                    </button>
                )}
            </div>
        </div>
    );
}
