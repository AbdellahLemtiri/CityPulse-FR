// const students = [
//   { id: 1, name: "Ali", score: 12, status: "en cours" },
//   { id: 2, name: "Sara", score: 16, status: "validé" },
//   { id: 3, name: "Omar", score: 8, status: "rattrapage" },
//   { id: 4, name: "Aida", score: 14, status: "validé" }
// ];

// for(let i  = 0 ;i<students.len)

// const chaine = 'helo';
// let chainII = '';
// for(let i = chaine.length-1 ; i >=0 ; i--)
// {
//   chainII += chaine[i];

// }
// console.log(chainII);

// const c = "Le développement web est fascinant";
// let maxletr = "";
// let maxint = 0;
// for (let i = 0; i < c.length; i++)
//   {
//     let compteur = 0;
//     for(let j= 0 ;j<c.length ;j++)
//     {
//         if(c[i] === c[j])
//         {
//           compteur += 1;
//         }
//     }

//     if(compteur > maxint )
//     {
//       maxint = compteur;
//       maxletr = c[i];
//     }

//   }
//   console.log(maxint);
//   console.log(maxletr);

// let inpute = "aaabbbdbaaaaa";

// const c = "aaabbbdbaaaaa";
// let maxletr = "";
// let maxint = 0;
// for (let i = 0; i < c.length; i++) {
//     let compteur = 0;
//     for (let j = 0; j < c.length; j++) {
//         if (c[i] === c[j]) {
//             compteur += 1;
//         }
//     }

//     if (compteur > maxint) {
//         maxint = compteur;
//         maxletr = c[i];
//     }
// }
// let n = c.length;
// console.log(n);

// let cmt = 0;
// for (let i = 0; i < n; i++) {
//     if (c[i] === maxletr) {
//         c[i] = c[i+1];
//         cmt += 1;
//     }
// }

// Exercice 1 : Filtrage d'un tableau d'objets
// Tu as un tableau d'utilisateurs. Écris une fonction qui retourne uniquement les utilisateurs majeurs (25 ans ou plus).
// JavaScript
const users = [
    { name: "Sami", age: 19 },
    { name: "Aya", age: 26 },
    { name: "Aziz", age: 25 },
    { name: "Laila", age: 17 },
];

// Ton code ici (utilise .filter())

// const filterData = users.filter((u) => {
//     return u.age > 25;
// });
// console.log(filterData);

// Exercice 2 : Transformation (Le formatage)
// Imagine que tu reçois une liste de produits. Tu dois créer un nouveau tableau qui contient uniquement les noms des produits, mais tout en majuscules.
// JavaScript
const produits = [
    { id: 1, nom: "clavier", prix: 200 },
    { id: 2, nom: "souris", prix: 100 },
    { id: 3, nom: "écran", prix: 1500 },
];

// const newTable = produits.map((p) => {
//     return p.nom.toLowerCase();
// });
// console.log(newTable);

// Tu as un panier d'achat. Calcule le prix total de tous les articles. Ensuite, trouve si un article nommé "Laptop" est présent dans le panier.
// JavaScript
const panier = [
    { article: "Laptop", prix: 8000 },
    { article: "Sac", prix: 300 },
    { article: "Souris", prix: 150 },
];

// 1. Calcule le total (indice : utilise .reduce() ou une boucle)
// 2. Vérifie si "Laptop" existe (indice : utilise .find() ou .some())

// const total = panier.reduce((acc, item) => {
//     return (acc += item.prix);
// }, 0);

// console.log(total);

// let tot = 0;
// panier.forEach((element) => {
//     tot += element.prix;
// });
// console.log(tot);

// Exercice 4 : La Gestion de Stock (Chaînage)
// C'est une situation très courante : tu dois enchaîner les méthodes. À partir du tableau stock,
// récupère uniquement les noms des produits dont la quantité est supérieure à 0, et affiche-les en minuscules.
// JavaScript
const stock = [
    { nom: "PC", qte: 5 },
    { nom: "CLAVIER", qte: 0 },
    { nom: "SOURIS", qte: 10 },
    { nom: "ECRAN", qte: 0 },
];

// Indice : stock.filter(...).map(...)

// let newT = stock
//     .filter((s) => {
//         return s.qte > 0;
//     })
//     .map((e) => {
//         return e.nom.toLowerCase();
//     });

// console.log(newT);

// Exercice 5 : Mise à jour d'objet (Le CRUD)
// Imagine que tu veux appliquer une promotion de 10% sur tous les articles du
// , mais seulement si le prix de base est supérieur à 500 DH.
// JavaScript

const articles = [
    { nom: "Casque", prix: 150 },
    { nom: "Smartphone", prix: 4500 },
    { nom: "Câble USB", prix: 50 },
];

// Objectif : créer un nouveau tableau 'promo' avec les prix modifiés

//
// console.log(promo);

// Exercice : Calculer le total par catégorie Imagine que tu as une liste de transactions.
//  Tu dois calculer le montant total dépensé uniquement pour la catégorie "Food".
// JavaScript
const transactions = [
    { id: 1, category: "Food", amount: 50 },
    { id: 2, category: "Tech", amount: 1200 },
    { id: 3, category: "Food", amount: 30 },
    { id: 4, category: "Transport", amount: 20 },
];

// Objectif : Trouve le total pour "Food"
// Indice : Tu peux filtrer d'abord, puis utiliser reduce (ou un forEach).

// let totals = transactions.reduce((acc, item) => {
//     if (item.category === "Food") acc += item.amount;

//     return acc;
// }, 0);
// console.log(totals);
// console.log("==================");

// let sum = 0;
// for (let i = 0; i < transactions.length; i++)
//   {
//       if(transactions[i].category == "Food")
//       sum += transactions[i].amount;

//   }
// console.log(sum);

// Exercice 7 : Le système de recherche (Multi-critères)
// Dans une application, l'utilisateur tape souvent un mot-clé.
// Tu dois filtrer un tableau d'artisans selon deux critères : le nom OU la spécialité.
// JavaScript
const artisans = [
    { id: 1, nom: "Ahmed", specialite: "Plombier", note: 4.5 },
    { id: 2, nom: "Yassine", specialite: "Électricien", note: 4.8 },
    { id: 3, nom: "Karim", specialite: "Plombier", note: 3.9 },
];

const recherche = "hm"; // Le mot-clé tapé par l'utilisateur

// Objectif : Retourne les artisans dont le nom OU la spécialité
// contient la chaîne 'recherche' (pense à .includes() et .toLowerCase())

// const final = artisans.filter((a) => {
//     return a.nom.includes(recherche) || a.specialite.includes(recherche);
// });
// console.log(final);
// console.log(
//     "-------------------------------------------------------------------",
// );

// Exercice 9 : Le "Group By" avec Reduce (Niveau Avancé)
// C'est l'exercice le plus difficile. Tu as une liste de tâches, et tu veux savoir combien il y en a par statut.
// JavaScript
const tasks = [
    { title: "Réviser JS", status: "done" },
    { title: "Coder API", status: "todo" },
    { title: "Préparer PFE", status: "todo" },
    { title: "Sport", status: "done" },
    { title: "Dormir", status: "todo" },
];

// Objectif : Utiliser .reduce() pour obtenir un objet de stats :
// Résultat attendu : { todo: 3, done: 2 }

// Indice : let stats = tasks.reduce((acc, task) => { ... }, { todo: 0, done: 0 })

// let newData = tasks.reduce((acc, { status, title }) => {
//     if (!acc[status]) {
//         acc[status] = { total: 0 };
//     }
//     acc[status].total++;
//     return acc;
// }, {});

// console.log(newData);

// xercice 10 : L'aplatisseur (Flatten) et le Nettoyage
// Tu reçois des données d'utilisateurs par "lots", et malheureusement, certains sont en double.
// Aplatir le tableau (passer d'un tableau de tableaux à un seul tableau).
// Sue).upprimer les doublons en se basant sur l' id (l'ID doit être uniq
// JavaScript
const lots = [
    [
        { id: 1, name: "Sami" },
        { id: 2, name: "Aya" },
    ],
    [
        { id: 2, name: "Aya" },
        { id: 3, name: "Aziz" },
    ],
    [{ id: 4, name: "Yassine" }],
];

// lots.flat();
// console.log();

// Objectif : Obtenir un tableau simple avec 4 objets uniques.
// Indice : Utilise .flat() puis .reduce() ou .filter() avec .findIndex()

// Exercice 12 : Transformer une liste en Arborescence (Tree)
// C'est l'exercice le plus difficile de la série. Tu as une liste de commentaires à plat, et tu dois les transformer en
//  "fil de discussion" (Thread) en utilisant le parentId.
// JavaScript

// Objectif : Transformer ce tableau pour que les réponses soient
// dans une propriété "replies" de leur parent.
/* Résultat attendu :
[
  { 
    id: 1, text: "...", replies: [
      { id: 2, text: "...", replies: [{ id: 4, ... }] },
      { id: 3, text: "..." }
    ] 
  }
]
*/
let tab = [];

// comments.forEach(item=>{
//   let obj = {};
//     let replies =  comments.filter((c)=> c.parentId === item.id);
//     if(replies.length > 0)
//     {
//      obj = {item, replies : replies}
//      tab.push(obj);
//     }
//   })
// // console.log(tab);
// const comments = [
//     { id: 1, text: "Super article !", parentId: null },
//     { id: 2, text: "Merci !", parentId: 1 },
//     { id: 3, text: "Je suis d'accord", parentId: 1 },
//     { id: 4, text: "De rien", parentId: 2 },
// ];



// function ShowComment(comments,parentId)
// {
//   let result ;
//   result = comments.filter((c)=>c.id === parentId).map((c)=>
//   ...c,replies : ShowComment(comments,c.id)
//   )
//   return result;
// }

// let final = ShowComment(comments);
// console.log(final);


// function ShowComment(comments, parentId = null) {
//   return comments
//     .filter(c => c.parentId === parentId)
//     .map(c => ({
//       ...c,
//       replies: ShowComment(comments, c.id)
//     }));
// }

// const final = ShowComment(comments);
// console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
// console.log(JSON.stringify(final) );




const comments = [
    { id: 1, text: "Super article !", parentId: null },
    { id: 2, text: "Merci !", parentId: 1 },
    { id: 3, text: "Je suis d'accord", parentId: 1 },
    { id: 4, text: "De rien", parentId: 2 },
]


function showComments(comments,parentId = null)
{
   return comments.filter((c)=>{
        return c.parentId === parentId
    }).map((c)=>({...c,replies : showComments(comments,c.id)}));
}


console.log(showComments(comments))