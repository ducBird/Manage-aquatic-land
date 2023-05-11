Thư mục utils

Trong thư mục utils, chúng ta có thể đặt các hàm tiện ích để sử dụng trong nhiều phần khác nhau của ứng dụng.

Ví dụ, hàm formatCurrency để định dạng số tiền thành một chuỗi định dạng phù hợp với tiền tệ địa phương:

// utils/formatCurrency.js

export default function formatCurrency(amount, currencyCode) {
const formatter = new Intl.NumberFormat('en-US', {
style: 'currency',
currency: currencyCode,
});

return formatter.format(amount);
}

Hàm parseQueryString để phân tích chuỗi truy vấn của URL và trả về một đối tượng có các tham số và giá trị tương ứng:
// utils/parseQueryString.js

export default function parseQueryString(queryString) {
const params = {};
const regex = /([^&=]+)=([^&]\*)/g;

let match;
while ((match = regex.exec(queryString)) !== null) {
params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
}

return params;
}

Hàm debounce để giới hạn tốc độ gọi lại hàm trong quá trình tìm kiếm hoặc nhập liệu:
// utils/debounce.js

export default function debounce(callback, wait) {
let timeoutId;

return (...args) => {
clearTimeout(timeoutId);
timeoutId = setTimeout(() => {
callback.apply(this, args);
}, wait);
};
}

Hàm getImageUrl để lấy URL của hình ảnh từ đối tượng sản phẩm:
// utils/getImageUrl.js

export default function getImageUrl(product, size = 'medium') {
if (!product || !product.images || !product.images.length) {
return '/placeholder-image.png';
}

const image = product.images.find((img) => img.size === size);

return image ? image.url : product.images[0].url;
}
