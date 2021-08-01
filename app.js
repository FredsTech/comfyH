//DECLARATION OF VARIABLES

const cartBtn = document.querySelector('.cart-btn');//In the navbar

//Buttons in the .cart overlay div which also contains the cart 
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems= document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector(".product-center");

//Single Quotes or Double Quotes it doesn't really matter when working with querySelectors.
// CART
// ========

let cart = [];

// BUTTONS (Because we have already selected all the butons and its kinda will be recycling them when clearing the cart....)
// ============

let buttonsDOM = [] ;

//Get its data form the buttons query selector.It doesn't matter if we put the brackets at this poin maze
// Ata tukiideclare solo na tu assign an array afterwards...Itaoutput that array without nesting so the purpose to me is to tell 
//us that we are just generally initialising an empty array ambayo tutaipatia some kinda data later.


//GETTING THE PRODUCTS 
//==========================

class Products {
    async getProducts(){
        try {
            let result = await fetch('products.json');
            let data =await result.json();
            // console.log(data);//This is the raw data returned in the contentful like manner.
            // destructuring
            let products =data.items;//(The products holds the items array from the array returned.It is kinda more specific)
            // console.log(typeof(products));//It is an array of quite complex objects which contains objects within objects.
            products=products.map((item) =>{
                const {title,price} =item.fields;
                const {id}= item.sys;
                const image =item.fields.image.fields.file.url;  //DON'T DARE PUT PARANTHESIS ON THE IMAGE URL
                return {title,price,id,image}//Retuns the variables as array of objects 
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
  const buttons = [...document.querySelectorAll(".bag-btn")];

//   console.log(buttons);//They are 8 Array Buttons because we have already appended the 8 Array Products to the screen
  buttonsDOM = buttons;

//   console.log(buttonsDOM);//It is an array of 8 buttons since there are 8 products with that class as per now

       buttons.forEach(button=>{
           let id = button.dataset.id;
    //Checking if the item is already in the cart and the necessary actions to be taken....
    let inCart = cart.find(item => item.id === id);//returns either true or false
    if(inCart){
     //Actions to be taken (Disable the button and Change text to indicate that the item is already in the cat)
        button.innerText="In Cart";
        button.disabled=true;
    }//The else stament is removed because as we start out none of the elements will be in the cart so the else code executes eitherway
         button.addEventListener("click",events =>{
             events.target.innerText="In Cart";
             events.target.disabled="true";
        //Getting product from products in the  Local Storage
        let cartItem = {...Storage.getProduct(id),amount:1};
        //Add Product to the Cart Array
        cart = [...cart,cartItem];
        //Save the cart in the local Storage 
        Storage.saveCart(cart);
        //Set the cart values 
        this.setCartValues(cart);
        //Display Cart Item
        this.addCartItem(cartItem);
        //Show the cart
        this.showCart();
        //This methods are used to call the methods that have been initialized down there.... Class Methods require the real shit as their parameters whereas array methods we baptise the real stuff with new names ndo tuweze kuzimanipulate.
         });
       });
    }

// METHOD 3
// ==================================
     setCartValues(cart){
         let tempTotal = 0;
         let itemsTotal = 0;
         cart.map((item) =>{
             tempTotal += item.price*item.amount;
             itemsTotal +=item.amount;
         })
         cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
         cartItems.innerText = itemsTotal;
        //  console.log(cartTotal,cartItems); 
     }

// METHOD 4
// ==================================
  addCartItem(item){
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = ` 
       <img src=${item.image} alt="product">
                <div>
                    <h4>${item.title}</h4>
                    <h5>$${item.price}</h5>
                    <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <div>
                <i class="fas fa-chevron-up"  data-id=${item.id}></i> 
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down"  data-id=${item.id}></i>
                </div>
`
cartContent.appendChild(div);
// console.log(cartContent);
  }


// METHOD 5(SHOW CART)
// ==================================
  showCart() {

    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
}

}

//LOCAL STORAGE 

class Storage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));//serItem methods in local storage is used to store data (strings in key value pairs)
    }

    //Getting the product.
    //This method will require and id as the argument,The ID that we are obviously getting from the button.
    static getProduct (id){
        //We need to parse it since we has stored it as a string.
        let products = JSON.parse(localStorage.getItem('products'));//It will gonna require what we are getting from
        return products.find(product => product.id===id);
        
    }

    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart))//Converts the cart object to strings which can be stored in JSON format...
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

