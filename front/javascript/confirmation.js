// Je cherche a afficher le produit de cette page

let pageActuelle = window.location.href

// Page actuelle = String -> Il faut transformer cette variable en URL pour utiliser SearchParams
let url = new URL(pageActuelle);

// Je chercher à récupérer la variable order qui se trouve dans l'URL
let order = url.searchParams.get("order");

// ici j'affiche l'order (donc le numéro de commande) s'il n'est pas nul
if (order !== null) {
    document.getElementById("orderId").innerText = order;
}