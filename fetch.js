let raw = fetch("/home/alfred/Desktop/Sweet_Coding_Stuff/Javascript Small Projects/comfy-house/products.json").then((data)=>{
data=raw;
console.log(data);
}).catch((error)=>{
    console.log(error);
})
