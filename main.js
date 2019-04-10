const carBtn = document.querySelector('.cart-btn')
const closecartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.products-center')








let Cart = []
let ButtonsBOM = []

// getting the products
class Products {

    async getProducts() {
        try {
            let result = await fetch("products.json")
            let data = await result.json()

            let products = data.items

            products = products.map(item => {
                const {
                    title,
                    price
                } = item.fields

                const {
                    id
                } = item.sys
                const image = item.fields.image.fields.file.url

                return {
                    title,
                    price,
                    id,
                    image
                }

            })
            return products
        } catch (err) {
            console.log(err)
        }
    }



}
// ui classess
class UI {

    displayProducts(products) {

        let result = ''
        products.forEach(product => {

            result += ` <article class="product">
            <div class="img-container">
                <img src=${product.image}
                    alt="" class="product-img">
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to bag
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
        </article> `
        });

        productsDOM.innerHTML = result;

    }


    getBagButton() {

        const Buttons = [...document.querySelectorAll('.bag-btn')]

        let buttonsBOM = Buttons


        Buttons.forEach(button => {
            let id = button.dataset.id

            let incart = Cart.find(item => item.id === id)
            if (incart) {
                button.innerHTML = 'In Cart'
                button.disabled = true
            } else {


                button.addEventListener('click', (e) => {
                    e.target.innerHTML = 'In Cart'
                    e.target.disabled = true
                    e.target.style.cursor = "normal"
                    let CartItem = {
                        ...Storage.getProduct(id),
                        amount: 1
                    }
                    Cart = [...Cart, CartItem]

                    console.log(Cart)

                })
            }

        })
    }


}

// local storage

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"))
        return products.find(product => product.id == id)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const ui = new UI()
    const products = new Products()
    // get all the products

    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButton()
    })

})