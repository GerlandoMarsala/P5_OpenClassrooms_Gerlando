/*
On veut afficher les articles de la page index 
*/
function afficherProduit() {
    fetch("http://localhost:3000/api/products")
    .then (async response => {
        try{
          const products = await response.json();
          afficherResultat(products);
        }
        catch (e){
          console.log(e);
        }
    })
}


function afficherResultat(array) {
    array.forEach(data => {
       const a = document.createElement("a");
       a.setAttribute("href", `./product.html?id=${data._id}`)
       a.innerHTML =
       `
       <article>
       <img src="${data.imageUrl}" alt ="${data.altTxt}" >
       <h3 class="productName">${data.name}</h3>
       <p class="productDescription">${data.description}</p>
       </article>
       `;
       document.querySelector("#items").append(a);   
   });
 }
 
 
 
 
afficherProduit () ;
 


