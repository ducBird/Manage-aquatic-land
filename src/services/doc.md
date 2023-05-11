Thư mục services

Trong thư mục services, chúng ta có thể đặt các tệp để tương tác với dữ liệu, như là các API hoặc các lớp đại diện cho các thực thể trong cơ sở dữ liệu.

Ví dụ tiếp theo, trong tệp cartService.js, chúng ta có thể định nghĩa các chức năng để tương tác với giỏ hàng của khách hàng:
// services/cartService.js

const CART_API_URL = 'https://example.com/api/cart';

async function fetchJson(url, options = {}) {
const response = await fetch(url, options);

if (!response.ok) {
throw new Error(`Request failed with status code ${response.status}`);
}

return response.json();
}

export async function getCart() {
const url = CART_API_URL;

return fetchJson(url);
}

export async function addToCart(productId, quantity) {
const url = `${CART_API_URL}/items`;

const response = await fetchJson(url, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
productId,
quantity,
}),
});

return response.item;
}

export async function removeFromCart(cartItemId) {
const url = `${CART_API_URL}/items/${cartItemId}`;

await fetchJson(url, {
method: 'DELETE',
});
}

Cuối cùng, trong tệp userService.js, chúng ta có thể định nghĩa các chức năng để tương tác với thông tin người dùng và đăng nhập:
// services/userService.js

const USER_API_URL = 'https://example.com/api/users';

async function fetchJson(url, options = {}) {
const response = await fetch(url, options);

if (!response.ok) {
throw new Error(`Request failed with status code ${response.status}`);
}

return response.json();
}

export async function registerUser(username, password) {
const url = `${USER_API_URL}/register`;

const response = await fetchJson(url, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
username,
password,
}),
});

return response.token;
}

export async function loginUser(username, password) {
const url = `${USER_API_URL}/login`;

const response = await fetchJson(url, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
username,
password,
}),
});

return response.token;
}

export async function getUserInfo(token) {
const url = `${USER_API_URL}/me`;

return fetchJson(url, {
headers: {
Authorization: `Bearer ${token}`,
},
});
}
