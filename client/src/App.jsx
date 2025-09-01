import React, { useEffect, useState } from 'react';
import axios from 'axios';
import riceImg from './assets/rice.jpg';
import sugarImg from './assets/Sugar.jpg';
import wheatFlourImg from './assets/wheat_flour.jpg';
import Salt from './assets/salt.jpg';
import CookingOil from './assets/cooking_oil.jpg';
import UradDal from './assets/urad_dal.jpg';
import MoongDal from './assets/moong_dal.jpg';
import ChanaDal from './assets/chana_dal.jpg';
import redLentilsImg from './assets/red_lentils.jpg';
import blackPepperImg from './assets/blackPepper.jpg';
import turmericPowderImg from './assets/turmeric_powder.jpg';
import corianderPowderImg from './assets/coriander_powder.jpg';
import cuminSeedsImg from './assets/cumin-seeds.jpg';
import  gingerGarlicPasteImg from './assets/ginger_garlic_paste.jpg';
import greenchiliImg from './assets/green_chilies.jpg';
import mustardSeedsImg from './assets/mustard_seeds .jpg';
import onionImg from './assets/onions.jpg';
import potatoImg from './assets/potatoes.jpg';
import tomatoImg from './assets/tomatoes.jpg';
import fallbackImg from './assets/fallback.jpg'; // if you use fallback from src too

//const url='https://smart-grocery-app-eutp.onrender.com/';

axios.defaults.withCredentials = true;

const getImageForItem = (name) => {
  const images = {
    Rice: riceImg,
    Sugar: sugarImg,
    'Wheat Flour': wheatFlourImg,
    Salt: Salt,
    'Cooking Oil': CookingOil,
    'Urad Dal': UradDal,
    'Moong Dal': MoongDal,
    'Chana Dal': ChanaDal,
    'Red Lentils': redLentilsImg,
    'Black Pepper': blackPepperImg,
    'Turmeric Powder': turmericPowderImg,
    'Coriander Powder': corianderPowderImg,
    'Cumin Seeds': cuminSeedsImg,
    'Ginger Garlic Paste': gingerGarlicPasteImg,
    'Green Chilies': greenchiliImg,
    'Mustard Seeds': mustardSeedsImg,
    'Onions': onionImg,
    'Potatoes': potatoImg,
    'Tomatoes': tomatoImg,
    
  };
  return images[name] || fallbackImg;
};


export default function App() {
  const [items, setItems] = useState([]);
  const [step, setStep] = useState('home');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const apiBase ="https://localhost:5000"
;

  useEffect(() => {
    axios.get(`${apiBase}/api/items`)
      .then(res => {
        // Normalize so items is ALWAYS an array
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.items) ? res.data.items : []);
        setItems(data);
      })
      .catch(err => console.error('Failed to load items', err));

    axios.get(`${apiBase}/api/auth/check-session`)
      .then((res) => setIsLoggedIn(res.data.loggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const sendOtp = async () => {
    try {
      await axios.post(`${apiBase}/api/auth/send-otp`, { mobile });
      setOtpSent(true);
    } catch (err) {
      alert('Failed to send OTP. Try again.');
      console.error('OTP sending failed', err);
      setMobile('');
      setOtpSent(false);
      setOtp('');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${apiBase}/api/auth/verify-otp`, { otp });
      setStep('home');
      setIsLoggedIn(true);
    } catch (err) {
      alert('Invalid OTP. Try again.');
      console.error('OTP verification failed', err);
      setOtp('');
      setOtpSent(false);
    }
  };

  const addToCart = async (itemId) => {
  try {
    await axios.post(`${apiBase}/api/items/add-to-cart`, {
      itemId,
      quantity: 1,
    });

    // Update local state
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: 1,
    }));
  } catch (err) {
    alert('Please login first!');
    setStep('login');
    console.error('Failed to add item to cart', err);
  }
};

const incrementCartItem = async (itemId) => {
  try {
    await axios.post(`${apiBase}/api/items/add-to-cart`, {
      itemId,
      quantity: 1,
    });

    setItemQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    fetchCart();
  } catch (err) {
    console.error('Failed to increment item in cart:', err);
  }
};

const decrementCartItem = async (itemId) => {
  try {
    await axios.post(`${apiBase}/api/items/remove-from-cart`, {
      itemId,
      quantity: 1,
    });

    setItemQuantities(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return {
        ...prev,
        [itemId]: current - 1,
      };
    });

    fetchCart();
  } catch (err) {
    console.error('Failed to decrement item in cart:', err);
  }
};


  const fetchCart = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/items/cart`);
      // Normalize so cartItems is ALWAYS an array
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.cart) ? res.data.cart : (Array.isArray(res.data?.items) ? res.data.items : []));
      setCartItems(data);
      setShowCart(true);
      setComparison(null);
    } catch (err) {
      alert('Please login to view cart');
      setStep('login');
      console.error('Failed to fetch cart', err);
      setShowCart(false);
      setCartItems([]);
    }
  };

  const compareStores = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/items/compare`);
      setComparison(res.data);
    } catch (err) {
      alert('Please login before comparing stores!');
      setStep('login');
      console.error('Failed to compare stores', err);
    }
  };

  const logout = async () => {
  try {
    await axios.post(`${apiBase}/api/auth/logout`);
    setStep('home');
    setOtpSent(false);
    setOtp('');
    setMobile('');
    setCartItems([]);
    setComparison(null);
    setShowCart(false);
    setIsLoggedIn(false);

    window.location.reload();
  } catch (err) {
    console.error('Logout failed:', err);
  }
};

  if (step === 'login') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Login with Mobile</h2>
        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full mb-4" onClick={sendOtp}>
          Send OTP
        </button>

        {otpSent && (
          <div>
            <input
              className="border p-2 w-full mb-3 rounded"
              placeholder="Enter OTP (use 12345)"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              onClick={verifyOtp}
            >
              Login
            </button>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-green-600 text-white px-6 py-4">
        <h1 onClick={() => { setStep('home'); setShowCart(false); setComparison(null); }} className="text-2xl font-bold cursor-pointer hover:text-green-200">🛒 Smart Grocery</h1>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <button onClick={() => { fetchCart(); }} className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100">Cart</button>
              <button onClick={logout} className="bg-white text-red-600 px-3 py-1 rounded hover:bg-red-100">Logout</button>
            </>
          ) : (
            <button onClick={() => setStep('login')} className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100">Login</button>
          )}
        </div>
      </div>

      <div className="py-8 px-4">
        {!showCart && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => {
              return (
                <div key={item._id} className="bg-white border border-green-300 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105">
                  <img
  src={getImageForItem(item.name)}
  alt={item.name}
  className="w-full h-40 object-cover rounded-t-xl"
/>
                  <div className="bg-white text-black p-4 rounded-b-xl">
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-sm">Weight: {item.weight}</p>
                    <p className="text-sm">Avg Price: ₹{item.avgPrice}</p>
                    {itemQuantities[item._id] ? (
  <div className="flex justify-between items-center bg-green-600 text-white font-bold rounded-full px-4 py-2 w-half mt-3 ">
    <button onClick={() => decrementCartItem(item._id)} className="text-xl">−</button>
    <span>{itemQuantities[item._id]}</span>
    <button onClick={() => incrementCartItem(item._id)} className="text-xl">+</button>
  </div>
) : (
  <button
    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
    onClick={() => addToCart(item._id)}
  >
    Add to Cart
  </button>
)}

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showCart && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">🛒 Your Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">Cart is empty.</p>
            ) : (
              <>
                <ul className="space-y-4">
  {cartItems.map(({ itemId, quantity }, idx) => (
    <li key={idx} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
      <span className="font-medium">{itemId.name}</span>
      <div className="flex items-center gap-2">
        <button
          className="bg-green-600 text-white w-7 h-7 rounded-full text-lg"
          onClick={() => decrementCartItem(itemId._id)}
        >−</button>
        <span className="font-bold text-lg">{quantity}</span>
        <button
          className="bg-green-600 text-white w-7 h-7 rounded-full text-lg"
          onClick={() => incrementCartItem(itemId._id)}
        >＋</button>
      </div>
    </li>
  ))}
</ul>

                <div className="text-center mt-6">
                  <button onClick={compareStores} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-md shadow">
                    Compare Stores
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {comparison && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">📊 Store Comparison</h2>
            <ul className="space-y-2">
              {Object.entries(comparison).map(([store, total]) => (
                <li key={store} className="flex justify-between text-lg">
                  <span className="font-medium text-green-700">{store}</span>
                  <span className="text-green-900 font-bold">₹{total}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
