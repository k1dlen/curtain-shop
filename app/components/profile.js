"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import Register from "./register";
import Login from "./login";
import Logout from "./logout";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [orders, setOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState({});
  const router = useRouter();

  const toggleOrder = (orderId) => {
    setOpenOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      const user = JSON.parse(storedUser);

      const response = await fetch(`/api/order/get?user_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
          <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
            {showRegister ? (
              <Register setUser={setUser} />
            ) : (
              <Login setUser={setUser} />
            )}
            <button
              onClick={() => setShowRegister(!showRegister)}
              className="w-full text-center font-roboto text-lg hover:underline"
            >
              {showRegister
                ? "Уже есть аккаунт? Войти"
                : "Нет аккаунта? Зарегистрироваться"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 my-10">
          <div className="container bg-white shadow-lg rounded-lg p-8 w-full text-color">
            <h1 className="font-playfair text-3xl font-semibold text-center mb-4 title-color ">
              Добро пожаловать, {user.full_name}
            </h1>
            <h2 className="font-playfair text-2xl font-semibold title-color my-2">
              Ваши данные:
            </h2>
            <p className="font-roboto">Имя: {user.full_name}</p>
            <p className="font-roboto">Телефон: {user.phone}</p>
            <div>
              <h2 className="font-playfair text-2xl font-semibold title-color my-2">
                Ваши заказы:
              </h2>
              {orders.length === 0 && <p>У вас нет заказов</p>}
              {orders.map((order, i) => (
                <div
                  key={order.order_id}
                  className="mb-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                >
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleOrder(order.order_id)}
                  >
                    <div>
                      <h3 className="font-roboto font-medium text-lg title-color">
                        Заказ №{i + 1}
                      </h3>
                    </div>
                    <button
                      className="p-2 rounded-full transition-all duration-300 ease-in-out"
                      aria-expanded={openOrders[order.order_id] || false}
                    >
                      <svg
                        className={`w-6 h-6 transform  transition-all duration-300 ease-in-out ${
                          openOrders[order.order_id] ? "" : "rotate-180"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {openOrders[order.order_id] && (
                    <div className="p-4 pt-0 border-t animate-slideDown transition-all duration-300 ease-in-out">
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <p className="font-roboto text-color">Дата заказа:</p>
                          <p className="font-roboto font-medium">
                            {order.order_date}
                          </p>
                        </div>
                        <div>
                          <p className="font-roboto text-color">Сумма:</p>
                          <p className="font-roboto font-medium text-green-600">
                            {order.total_amount} ₽
                          </p>
                        </div>
                        <div>
                          <p className="font-roboto text-color">Статус:</p>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              order.order_status === "Доставлен"
                                ? "bg-green-100 text-green-800"
                                : order.order_status === "Отменен"
                                ? "bg-red-100 text-red-800"
                                : order.order_status === "В пути"
                                ? "bg-orange-100 text-orange-800"
                                : order.order_status === "Ожидает доставки"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.order_status === "В обработке"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-playfair text-xl font-semibold mt-4">
                        Товары в заказе:
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {order.order_items.map((item) => (
                          <li
                            key={item.product_id}
                            className="flex justify-between border-b py-2"
                          >
                            <div>
                              <p className="font-roboto font-medium">
                                {item.product_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Количество: {item.count}
                              </p>
                            </div>
                            <div>
                              <p className="text-green-600 font-medium">
                                {item.price} ₽
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {user.id_role === 2 && (
              <div className="mt-4">
                <button
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 main-button"
                >
                  Панель администратора
                </button>
              </div>
            )}

            <div className="mt-4">
              <Logout setUser={setUser} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
