// On récupère les données du panier dans le localStorage et on les convertis en tableau
let localData = JSON.parse(localStorage.getItem("dataProduct"));
let totalPrice = [];
document.getElementById("totalPrice").innerHTML = 0;


// On vérifie si la variable n'est pas null (null = inexistante)
if (localData !== null) {

  // On crée une boucle for, de la taille du panier et on appelle la fonction afficher un produit pour afficher un produit singulier
  for (let i = 0; i < localData.length; i++) {
    afficherUnProduit(localData[i].id, localData[i].quantity, localData[i].color)
  }
}

// Fetch = se connecte a l'API
function afficherUnProduit(id, quantity, color) {
  fetch(`http://localhost:3000/api/products/${id}`)

    // then = recupère les données et les stockes dans une variable asynchrone (permet de faire plusieurs fonctions par ordre de priorité)
    .then(async response => {

      try {
        const product = await response.json();
        let listProduct = document.getElementById("cart__items");
        // On crée une div pour pouvoir insérer plus facilement l'intégralité de l'article            
        let div = document.createElement("div");

        div.innerHTML =
          `
             <article class="cart__item" data-id="${id}" data-color="${color}">
            <div class="cart__item__img">
              <img src="${product.imageUrl}" alt="${product.altText}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${color}</p>
                <p>${product.price}€</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article> 
            `;
        // On ajoute notre div a notre liste d'item           
        listProduct.append(div);

        // j'insère les données du produit 
        // -> id pour l'identifier lors du changement de quantitées
        // -> prix unitaire pour le montant de la réduction
        // prix total pour additionner tous les prix totaux
        totalPrice.push({
          id: id,
          price: parseInt(product.price) * parseInt(quantity),
          singlePrice: product.price,
        });


      }
      // Affiche une erreur s'il y en a une, a la place de faire "planter le site".
      catch (e) {
        console.log(e);
      }

      // j'appelle la fonction qui va afficher le prix total du panier
      setTotalPrice();

    })

}



// Suite partie 9

const selectorItems = document.getElementById("cart__items");

// changer les quantités d'un produit
selectorItems.addEventListener("change", (event) => {
  const cartItem = event.target.closest(".cart__item");
  modificationProduct(localData, cartItem, event);
  localStorage.clear();
  localStorage.setItem("dataProduct", JSON.stringify(localData));
})

// Suppression d'un element HTML avec removeChild: on récupère le parent de cartItem (lui est l'enfant direct).
// On supprimer l'article dupanier (en  front)
selectorItems.addEventListener("click", (event) => {
  if (event.target.className === "deleteItem") {
    const cartItem = event.target.closest(".cart__item");
    const parentOfCartItem = cartItem.parentNode.parentNode;
    parentOfCartItem.removeChild(cartItem.parentNode);

    // On supprimer l'article dupanier (en  back)
    suppressionProduct(localData, cartItem);
    localStorage.clear();
    localStorage.setItem("dataProduct", JSON.stringify(localData));
  }

})

// permet d'afficher le prix du panier
function setTotalPrice() {
  var price = 0;
  totalPrice.forEach(value => {
    price += value.price;

  })
  document.getElementById("totalPrice").innerHTML = price;
}

function suppressionProduct(array, element) {
  let index = array.findIndex(x => x.id === element.dataset.id && x.color === element.dataset.color);
  let indexTotalPrice = totalPrice.findIndex(x => x.id === element.dataset.id);
  array.splice(index, 1);
  totalPrice.splice(indexTotalPrice, 1)
  setTotalPrice();

}

function modificationProduct(array, element, event) {
  let index = array.findIndex(x => x.id === element.dataset.id && x.color === element.dataset.color);
  let indexTotalPrice = totalPrice.findIndex(x => x.id === element.dataset.id);
  array[index].quantity = parseInt(event.target.value);
  totalPrice[indexTotalPrice].price = (parseInt(array[index].quantity) * totalPrice[indexTotalPrice].singlePrice);
  setTotalPrice();
}

// Fin etape 9 


// Etape 10 

class Contact {
  constructor(firstName, lastName, address, city, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.email = email;
  }
}

// On intercepte les données envoyer dans le formulaire, 
let form = document.getElementsByTagName("form")[0];
form.addEventListener('submit', function (event) {

  // Avant tout de chose, nous vérifions si le panier n'est pas vide ! 
  // car l'utilisateur peut potentiellement remplir le formulaire et envoyer des données sans produits
  if (localData !== null) {
    let isValideForm = true;
    document.getElementById('firstNameErrorMsg').innerHTML = '';
    document.getElementById('lastNameErrorMsg').innerHTML = '';
    document.getElementById('addressErrorMsg').innerHTML = '';
    document.getElementById('cityErrorMsg').innerHTML = '';
    document.getElementById('emailErrorMsg').innerHTML = '';

    // Cette regex vérifie si la valeur du nom ou prénom contient uniquement des lettres en
    // minuscule ou majuscule, de minimum 2 charactères jusqu'à 50 charactères
    const regexNom = /^[a-zA-Z-]{2,50}$/;
    // De même pour l'adresse postale, sauf qu'ici on autorise les espaces, et 100 charactères max
    const regexAdresse = /^[a-zA-Z0-9 ]{2,100}$/;

    // de même sauf à la place de l'espace on autorise les tirets (pour les villes de nom composés)
    const regexCity = /^[a-zA-Z-]{2,100}$/;

    // regex email assez complexe qui autorise : ->
    // -> les lettres minuscules et majuscules
    // -> comproenant des chiffres
    // -> on autorise les charactères suivant : . _ - 
    // cette chaine de charactère est suivit OBLIGATOIREMENT d'un @
    // après l'@ on autorise les même charac que pour la première étape
    // S'ensuit avec uniquement des lettres en minus ou majus dont mini 2 charac et max 4 charac
    const regexEmail = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // On verifie pour chaque input s'il ne correspond pas a la regex, dans ce cas on affiche un message d'erreur 
    if (!document.getElementById('firstName').value.match(regexNom)) {
      isValideForm = false;
      document.getElementById('firstNameErrorMsg').innerHTML = 'Le nom est obligatoire et doit contenir entre 2 et 50 lettres.';
    } else {
      var formFirstName = document.getElementById('firstName');
    }


    if (!document.getElementById('lastName').value.match(regexNom)) {
      isValideForm = false;
      document.getElementById('lastNameErrorMsg').innerHTML = 'Le prénom est obligatoire et doit contenir entre 2 et 50 lettres.';
    } else {
      var formLastName = document.getElementById('lastName');
    }


    if (!document.getElementById('address').value.match(regexAdresse)) {
      isValideForm = false;
      document.getElementById('addressErrorMsg').innerHTML = "L'adresse ne doit pas contenir plus de 100 caractères.";
    } else {
      var formAddress = document.getElementById('address');
    }

    if (!document.getElementById('city').value.match(regexCity)) {
      isValideForm = false;
      document.getElementById('cityErrorMsg').innerHTML = 'La ville est obligatoire.';
    } else {
      var formCity = document.getElementById('city');
    }

    if (!document.getElementById('email').value.match(regexEmail)) {
      isValideForm = false;
      document.getElementById('emailErrorMsg').innerHTML = "L'adresse email est incorrecte.";
    } else {
      var formEmail = document.getElementById('email');
    }

    // S'il y a au moins une erreur (le formulaire est donc de valeur false) on n'envoie pas le formulaire de la façon suivante
    if (!isValideForm) {
      // permet de ne pas submit le formulaire si on utilise la fonction addEventListener
      event.preventDefault();
    } else {
      // donc le formulaire est de OK (valeur : true)

      // On créer un objet "Contact" grâce à la class Contact préalablement créée.  
      const contact = new Contact(formFirstName.value, formLastName.value, formAddress.value, formCity.value, formEmail.value);

      // on rajoute l'ID du produit dans le tableau de données
      const produit = tableauProduit(localData);

      // on envoie les données avec la méthode POST dans l'api 
      recap(contact, produit);

      // ici le formulaire BEAUCOUPS de données, et le formulaire est prêt à être envoyer...
      // CONSEQUENCE : -> l'url après envoie contiendra les valeurs du prénom, nom, adresse, adresse mail etc.. 
      // cela fait beaucoup trop de données, et nous souhaitons envoyer les données vers la page confirmation
      // SOLUTION: -> supprimer toutes les données du formulaire (puisqu'elles sont déjà envoyer à l'api donc elles sont désormait inutile)
      // afin d'avoir une URL épuré
      // la fonction clear form va : 
      // -> vider le formulaire
      // -> ajouter le numéro de commande dans le formulaire
      form = clearForm(form);

      // la commande est envoyé, nous pouvons supprimer les produits du panier qui sont stockés dans le localStorage
      localStorage.removeItem("dataProduct");

      // ici nous rajouter l'attribut ACTION au formulaire pour rediriger l'envoie des données (donc le numéro de commande) vers confirmation.html
      form.action = "confirmation.html";
    }
  } else {
    // je stop l'envoie du formulaire
    event.preventDefault();

    // j'affiche une alert pour le client 
    alert("Votre panier est vide ! ");
  }


});


function tableauProduit(array) {
  return array.map(item => item.id);
};

function recap(contact, produit) {
  fetch(`http://localhost:3000/api/order`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact, produit })

  })

};

function clearForm(form) {
  // boucle WHILE qui : 
  // -> tant qu'il y a un enfant, supprime le premier enfant (jusqu'a que le formulaire soit totalement vide)
  while (form.firstChild) {
    form.removeChild(form.firstChild);
  }
  // le formulaire est enfin  vide nous pouvons créer notre numéro de commande

  // Nous générons aléatoirement un nombre grâce au Math.random qui retourne un chiffre inférieur à 1 (sous cette forme par exemple: 0.456546584) 
  // nous le multiplions par 1000 afin d'obtenir un nombre à 3 chiffres (pour avoir un numéro de commande conséquent)
  // Math.floor vas simplement arondir notre calcul puisqu'il contient des virgules ()
  let idOrder = Math.floor(Math.random() * 1000);

  // ici je créée un nouvel input pour notre formulaire vide afin d'envoyer seulement le numéro de commande
  let orderInput = document.createElement('input');
  orderInput.type = 'hidden';
  orderInput.value = idOrder;
  orderInput.name = "order";
  form.appendChild(orderInput);

  // la fonction retourne le nouveau tableau contenant uniquement le numéro de commande
  return form;
}



