//DECLARATION OF VARIABLES

const cartBtn = document.querySelector('.cart-btn');//In the navbar

//Buttons in the .cart overlay div which also contains the cart 
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('cart-overlay');
const cartItems= document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector(".product-center");


//CART

let cart = [];

//Buttons(Because we have already selected all the butons and its kinda will be recycling them when clearing the cat....)

let buttonsDOM = [];


//GETTING THE PRODUCTS 

class Products {
    async getProducts(){
        try {
            let result = await fetch('products.json');
            let data =await result.json();
            // destructuring
            let products =data.items;//(The products holds the items array from the array returned.)
            products=products.map((item) =>{
                const {title,price} =item.fields;
                const {id}= item.sys;
                const image =item.fields.image.fields.file.url;  //DON'T DARE PUT PARANTHESIS ON THE IMAGE URL
                return {title,price,id,image}
            })
            return products;
   
        } catch (error) {
            console.log(error);
        }
    }
}
//DISPLAYING PRODUCTS 

class UI{

    //METHOD 1
    //======================
    displayProducts(products){
        let result = "";

        products.forEach(product=>{
            result +=`
             <!-- single product -->
<article class="product">
    <div class="img-container">
        <img 
        src=${product.image}
         alt="product" 
         class="product-img">
        <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            add to bag
        </button>
    </div>
    <h3>${product.title}</h3>
    <h4>$${product.price}</h4>

</article>

    <!-- End of single product --></article>
            `; 
        });
//    console.log(result);
    productsDOM.innerHTML=result;
    }
    //METHOD 2
//===============================================
    getBagButtons(){
    //The spread operator converts the node list into an arrays for easier manipulation
  const buttons =[...document.querySelectorAll(".bag-btn")];

buttonsDOM = buttons;

       buttons.forEach((button)=>{
           let id = button.dataset.id;
    //Checking if the item is already in the cart and the necessary actions to be taken....
    let inCart=cart.find((item) =>{
        item.id===id //returns either true or false
    });
    if(inCart){
        //Actions to be taken (Disable the button and Change text to indicate that the item is already in the cat)
button.innerText="In Cart";
button.disabled=true
    }//The else stament is removed because as we start out none of the elements will be in the cart so the else code executes eitherway
         button.addEventListener("click",events =>{
             events.target.innerText="In Cart";
             events.target.disabled="true";
        //Getting Products from the Local Storage

        let cartItem = {...Storage.getProduct(id),amount:1};
        console.log(cartItem);
        //Add Product to the Cart
        //Save the cart in the local Storage 
        //Set the cart values 
        //Display Cart Item
        //Show the cart
         });
       });
    }
     
}

//LOCAL STORAGE 

class Storage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }

    //Getting the product.
    static getProduct (id){
        //We need to parse it since we has stored it as a string.
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id===id);
        
    }
}

//GEARING THINGS UP//CALLING THE METHODS IN THE CLASSES.(To use the methods in the UI and products class we have to 
//instantiate the classes just as we have done.) 

document.addEventListener("DOMContentLoaded", ()=>{
    //creating instances of the classes to be called
    const ui = new UI();
    const products = new Products();


    //get all products 
    products.getProducts().then((products)=>{
        //We run the methods that is in the UI class
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
ui.getBagButtons()
    });
});

