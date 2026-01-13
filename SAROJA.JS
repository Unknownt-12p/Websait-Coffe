let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-btn');
    const cartItems = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const orderForm = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMsg');

    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemDiv = btn.parentElement;
            const inputQty = itemDiv.querySelector('.qty');
            const itemName = inputQty.dataset.item;
            const price = parseInt(inputQty.dataset.price);
            const qty = parseInt(inputQty.value);

            if (qty < 1) return;

            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.qty += qty;
            } else {
                cart.push({ name: itemName, price: price, qty: qty });
            }
            updateCart();
            inputQty.value = 1; // Reset input setelah tambah
        });
    });

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.marginBottom = "5px";
            
            li.innerHTML = `
                <span>${item.name} (x${item.qty})</span>
                <span>Rp${(item.price * item.qty).toLocaleString()}</span>
                <button class="del-btn" data-index="${index}" style="background:red; color:white; border:none; border-radius:3px; cursor:pointer; margin-left:10px;">X</button>
            `;
            cartItems.appendChild(li);
            total += item.price * item.qty;
        });
        totalSpan.textContent = total.toLocaleString();

        // Tambah event listener untuk tombol hapus
        document.querySelectorAll('.del-btn').forEach(dBtn => {
            dBtn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                cart.splice(idx, 1);
                updateCart();
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang kosong!');
            return;
        }
        const nama = prompt('Masukkan nama Anda:');
        if (!nama) return;

        // Format order agar enak dibaca di Spreadsheet (Item1 x2, Item2 x1)
        const orderData = cart.map(item => `${item.name} (${item.qty})`).join(', ');
        const totalData = totalSpan.textContent.replace(/\./g, ''); // Hapus titik ribuan untuk angka murni

        document.getElementById('order-data').value = orderData;
        document.getElementById('total-data').value = totalData;
        orderForm.nama.value = nama;

        orderForm.style.display = 'flex'; // Gunakan flex agar rapi sesuai CSS
        checkoutBtn.style.display = 'none';
    });

    // MASUKKAN URL GOOGLE APPS SCRIPT ANDA DI SINI
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxuE3asPCQYM7BDd_aipCTJNolEznMGNTLam1vJFZozaoKiYhJuMF4HboMqL6LMs_cE4w/exec'; 

    orderForm.addEventListener('submit', e => {
        e.preventDefault();
        submitBtn.disabled = true;
        statusMsg.innerText = "Mengirim data ke sistem...";

        fetch(scriptURL, { method: 'POST', body: new FormData(orderForm)})
        .then(response => {
            statusMsg.innerText = "Data tersimpan! Membuka WhatsApp...";
            
            const nama = orderForm.nama.value;
            const order = orderForm.order.value;
            const total = parseInt(orderForm.total.value).toLocaleString();
            const phone = "628996293084";
            const msg = `Halo Sakopi Saroja, saya ingin pesan:\n\n*Nama:* ${nama}\n*Pesanan:* ${order}\n*Total:* Rp${total}`;
            
            setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                
                // Reset Semua
                cart = [];
                updateCart();
                orderForm.reset();
                orderForm.style.display = 'none';
                checkoutBtn.style.display = 'block';
                submitBtn.disabled = false;
                statusMsg.innerText = "";
            }, 1000);
        })
        .catch(error => {
            statusMsg.innerText = "Terjadi kesalahan koneksi.";
            submitBtn.disabled = false;
            console.error('Error!', error.message);
        });
    });
});