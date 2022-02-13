// Je cherche a afficher le produit de cette page

let pageActuelle = window.location.href

// Page actuelle = String -> Il faut transformer cette variable en URL pour utiliser SearchParams
let url = new URL(pageActuelle);
let id = url.searchParams.get("id");

// Fetch = se connecte a l'API
function afficherUnProduit() {
  fetch(`http://localhost:3000/api/products/${id}`)

    // then = recupère les données et les stockes dans une variable asynchrone (permet de faire plusieurs fonctions par ordre de priorité)
    .then(async response => {

      try {
        const product = await response.json();
        // console.log(product); 

        // Créer une balise img + Texte

        const img = document.createElement("img");
        img.setAttribute("src", `${product.imageUrl}`)
        img.setAttribute("alt", `${product.altTxt}`);

        // Alternative document.GetElementsByClassName (item_img) (append permet d'insérer la nouvelle image créer)
        document.querySelector(".item__img").append(img);

        // Permet de récupérer la balise titre et de l'afficher
        const h1 = document.getElementById("title");
        h1.innerText = `${product.name}`;

        // Permet de récupérer la balise prix et de l'afficher       
        const price = document.getElementById("price");
        price.innerText = `${product.price}`;

        // Permet de récupérer la balise description et de l'afficher
        const description = document.getElementById("description");
        description.innerText = `${product.description}`;

        // console.log(product.colors);

        // Product.colors est un Array, il faut donc itéirer sur chacune de ces valeurs pour les afficher 
        product.colors.forEach(color => {
          const option = document.createElement("option");
          option.setAttribute("value", `${color}`);
          option.textContent = `${color}`;
          document.getElementById("colors").append(option);
        });


      }
      // Affiche une erreur s'il y en a une, a la place de faire "planter le site".
      catch (e) {
        console.log(e);
      }
    })

}

afficherUnProduit();

// recupération du boutton et ajout d'une fonction 
const ajouterAuPanier = document.getElementById("addToCart");

ajouterAuPanier.addEventListener("click", () => {

  // Permet de gerer les erreurs quand aux choix de l'utilisateur
  const selectColor = document.getElementById("colors");
  const quantiteArticle = document.getElementById("quantity");
  if (selectColor.value === "") {
    alert("S'il vous plait, choisissez une couleur");
  } else if (!parseInt(quantiteArticle.value)) {
    alert("S'il vous plait, choississez la quantité de produit");
  } else {


    // On vérifie si la clé dataProduct N'existe pas > alors on l'a crée
    if (!localStorage.getItem("dataProduct")) {

      // On crée une variable sous forme de tableau avec les données du produit pour pouvoir utiliser la fonction push
      // on formate les données sous forme de JSON en insérant les données du produit actuel
      let dataProduct = new Array({
        "id": id,
        "color": selectColor.value,
        "quantity": quantiteArticle.value,
      })

      // envoie des données pour la premiere fois dans le local storage
      // on transforme ces données en string car on ne peut pas envoyer de tableau de données proprement dans le localStorage
      localStorage.setItem("dataProduct", JSON.stringify(dataProduct));
    } else {

      // Si elle existe, On récupère les données et on les convertis en tableau
      let localData = JSON.parse(localStorage.getItem("dataProduct"));


      // On créer une variable sans new Array car local data est déja un tableau
      let dataProduct = {
        "id": id,
        "color": selectColor.value,
        "quantity": quantiteArticle.value,
      }

      // On appelle findID pour savoir si le produit et la couleur sont déja dans le local storage
      let isProductInCart = findID(localData, dataProduct.id, dataProduct.color);

      // Si le produit et la couleur sont déja présent dans le local storage alors on Upgrade la quantité
      if (isProductInCart !== false) {
        localData[isProductInCart].quantity = dataProduct.quantity

        // Si non, on l'insert simplement dans le local storage
      } else {
        localData.push(dataProduct)
      }

      // On envoie ici, les données modifiées
      localStorage.setItem("dataProduct", JSON.stringify(localData));

    }

    alert("Super! Votre produit à été ajouté au panier!")

  }
})
// On appelle findID pour savoir si le produit et la couleur sont déja dans le local storage
// On parcours la liste de produit qui est présent dans le local storage,
// Si on trouve un produit dans ce tableau qui a le meme ID et la meme couleur passé en parametre alors on retourne sa position avec l'index i
// Sinon, on retourne juste False
// BOUCLE FOR
function findID(array, id, color) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id && array[i].color === color) {
      return i
    }
  }
  return false;
}







