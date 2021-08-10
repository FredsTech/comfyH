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

let cart = [];//At this point the cart is empty and we have to start populating the cart and this will only be made possible by the click button.

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
            add to cart
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
    //METHOD 2(ADDS AN ITEM TO THE CART BY MANIPULATING THE BUTTONS)
//===============================================
    getBagButtons(){
 //The spread operator converts the node list into an arrays for easier manipulation
  const buttons = [...document.querySelectorAll(".bag-btn")];

//   console.log(buttons);//They are 8 Array Buttons because we have already appended the 8 Array Products to the screen
  buttonsDOM = buttons;

//   console.log(buttonsDOM);//It is an array of 8 buttons since there are 8 products with that class as per now

       buttons.forEach(button => {
           let id = button.dataset.id;

           console.log(id);
    //Checking if the item is already in the cart and the necessary actions to be taken....
    let inCart = cart.find(item => item.id === id);//returns either true or false if the items id matches the buttons dataset id that it represents 
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

// METHOD 3(METHOD FOR GETTING CART TOTALS AND ITEMS TOTALS)
// ==============================================================
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

// METHOD 4(ADDING CART ITEMS TO THE DOM)
// ==================================
  addCartItem(item){
      const div = document.createElement("div");
      div.classList.add("cart-item");//Baptising the new div in town with a class name.
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


// METHOD 5(SHOW CART WHICH MAINLY DEALS WITH CSS.)
// ====================================================
  showCart() {

    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
}


// METHOD 6(RUNS IMEDIATELY THE WEB APP IS OPENED TO CHECK IF THERE ARE ANY ITEMS IN THE CART)
// ============================================================================================
//This is where the main dramas of the cart happen where we set up the cart,
setupAPP(){
cart = Storage.getCart(); //Runing the methods that checks it there are any items in the cart and if any it returns them to the cart array. 

this.setCartValues(cart);

this.populateCart(cart);

cartBtn.addEventListener('click',this.showCart);
 closeCartBtn.addEventListener('click',this.hideCart);

}

// METHOD 7 (METHOD TO ADD ITEMS TO THE CART)== >> DEALS WITH THE CART IN THE DOM
// =============================================

populateCart(cart){//Looks for an argument of an array
    cart.forEach(item => this.addCartItem(item));
}

// METHOD 8(METHOD TO HIDE THE CART )
// ===================================  

hideCart(){
     cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");

}


// METHOD 9(We set up the cart Logic,where we can remove items.Append Items ,Increase and decrease the numbers etc.)
// ===================================  

cartLogic(){

//Clear cart Button 

clearCartBtn.addEventListener('click',() => {
    this.clearCart()
});//When Set up like this,The keyword this will be referencing the btn but not the ow

//cart functionality 
cartContent.addEventListener("click",event => {

//WORKS ON THE REMOVING ITEM BUTTONS WITH THE CLASS REMOVE ITEM.
if(event.target.classList.contains('remove-item'))
{
//ONLY SAVES THAT BUTTON THAT WHEN CLICKED ON HAS THE CLASS OF REMOVE-ITEMS
    let removeItem = event.target;
    let id = removeItem.dataset.id;//dataset accesses the attributes.
    cartContent.removeChild(removeItem.parentElement.parentElement);//Removes the item from the cart in the DOM.It moves two parents up inorder to access the whole
    this.removeItem(id);//Removes the items from the cart in the local storage 
}
//WORKS ON INCREASING THE QUANTITY OF ITEMS IN THE CART  THE CONDITION FORTHWITH CHECKS FOR THE CLASS YA FA-CHEVRON UP

else if(event.target.classList.contains("fa-chevron-up")) {
    let addAmount = event.target;//The chevron up button itself
    let id = addAmount.dataset.id;//The dataset-id for the chevron up button
    let tempItem = cart.find(item => item.id===id);
    tempItem.amount = tempItem.amount+1; 
    Storage.saveCart(cart);
    this.setCartValues(cart);
    addAmount.nextElementSibling.innerText = tempItem.amount;
}
else if (event.target.classList.contains("fa-chevron-down")){
    let lowerAmount = event.target; //Let it be the element being targeted by the click event
    let id = lowerAmount.dataset.id;
    let tempItem = cart.find(item => item.id===id);
    tempItem.amount = tempItem.amount - 1;

    if(tempItem.amount > 0){
        Storage.saveCart(cart);//This saves the new cart since we are constantly making adjustments to the cart
        this.setCartValues(cart);
        lowerAmount.previousElementSibling.innerText = tempItem.amount
    }else{
        cartContent.removeChild 
        (lowerAmount.parentElement.parentElement);
        this.removeItem(id);
    }


}
});
}


// METHOD 10
// =========
clearCart(){
    let  cartItems = cart.map((item)=>{//The new value of the cart item ni id
       return ( item.id);
    });
    cartItems.forEach(id => this.removeItem(id));//Removing the Items from the cart in the local storage

    while (cartContent.children.length>0){
        cartContent.removeChild(cartContent.children[0]);//Removing the items from the DOM
    }
    this.hideCart();
} 

//These method will require the ID as an argument
removeItem(id){
    //We start by filtering the cart inorder to remove the items.
    //This method gets all the ids and returns those that are not in the filter list....
    cart = cart.filter(item => item.id  !==id);
 //Once we have the new car items values we would want to update the cart values maze...and that is where this method comes in 
    this.setCartValues(cart);//Updated cart
    Storage.saveCart(cart);//Saving the new cart values.
    //WE NOW RESET THE BUTTONS OF THE REMOVEDe and id as the argument,The ID that we are obviously getting from the button.
    let button = this.getSingleButton(id);
//After running this method to get the methods...
    button.disabled = false;
    button.innerHTML = `<i class= "fas fa-shopping-cart"></i> add to cart`;

}
//GETS THAT INDIVIDUAL BUTTON TO RESET ITS STATUS
getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id === id);
}
//WE ARE SETTING UP THIS METHODS IN ORDER TO BE ABLE TO REUSE THEM IN FUTURE.

}



//LOCAL STORAGE 

class Storage {
    static saveProducts(products){
        // console.log(products);//proves that we pass in the products array to be manipulated in this method.
        localStorage.setItem("products",JSON.stringify(products));//serItem methods in local storage is used to store data (strings in key value pairs)
    }

    //Getting the product.
    //This method will require and id as the argument,The ID that we are obviously getting from the button.
    static getProduct (id){
        //We convert it back to an obhec via the parse JSON METHODS it since we has stored it as a string.
        let products = JSON.parse(localStorage.getItem('products'));//It will gonna require what we are getting from
        return products.find(product => product.id === id);
        
    }

    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart))//Converts the cart object to strings which can be stored in JSON format...
    }

    static getCart(){
    return localStorage.getItem ('cart')?JSON.parse
    (localStorage.getItem('cart')):[]
    }
}
 
//GEARING THINGS UP//CALLING THE METHODS IN THE CLASSES.(To use the methods in the UI and products class we have to 
//instantiate the classes just as we have done.) 

document.addEventListener("DOMContentLoaded", ()=>{
    //creating instances of the classes to be called
    const ui = new UI();
    const products = new Products();
    //PROCESS 1.
//setup app will be the first method to run...

ui.setupAPP();
    //PROCESS 2
    //The products will be fetched and then the rest follows 
    products.getProducts().then((products)=>{
        //We run the methods that is in the UI class
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
ui.getBagButtons();
ui.cartLogic(); 
    });
});

