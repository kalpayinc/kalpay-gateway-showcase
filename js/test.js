// a script for experimental purpose
var productQuty = document.getElementById('product-qty');
var incrementBtn = document.getElementById('increment-btn');
var decrementBtn = document.getElementById('decrement-btn');
incrementBtn.addEventListener('click', () =>{
    var product_qty = parseInt(productQuty.value);
    if(product_qty >= 1) {
        productQuty.value = product_qty + 1;
    }
})

decrementBtn.addEventListener('click', () =>{
    var product_qty = parseInt(productQuty.value);
    if(product_qty >= 2) {
        productQuty.value = product_qty - 1;
    }
})