const librairie = {
    library: {
        name: "Bibliothèque centrale",
        address: "10 rue de la Liberté, 75001 Paris",
        contact: {
            email: "contact@bibliotheque.fr",
            phone: "+33 1 23 45 67 89",
        },
        books: [
            {
                title: "Le Petit Prince",
                author: "Antoine de Saint-Exupéry",
                year: "19MM",
                pages: 156,
                available: true,
            },
            {
                title: "1984",
                author: "George Orwell",
                year: 1949,
                pages: 328,
                available: false,
            },
            {
                title: "Le rouge et le noir",
                author: "Stendhal",
                year: [1830, 1915],
                pages: 510,
                available: true,
            },
            {
                title: "L'Étranger",
                author: "Albert Camus",
                year: 1942,
                pages: 123,
                available: true,
            },
            {
                title: "Les Misérables",
                author: "Victor Hugo",
                year: 1862,
                pages: 1463,
                available: false,
            },
            {
                title: "La Nuit des temps",
                author: "René Barjavel",
                year: 1968,
                pages: 442,
                available: false,
            },
            {
                title: "Le Comte de Monte-Cristo",
                author: "Alexandre Dumas",
                year: 1844,
                pages: 1276,
                available: true,
            },
            {
                title: "Le Chardonneret",
                author: "Donna Tartt",
                year: 2013,
                pages: 771,
                available: true,
            },
            {
                title: "Sapiens: Une brève histoire de l'humanité",
                author: "Yuval Noah Harari",
                year: 2011,
                pages: 443,
                available: true,
            },
            {
                title: "Voyage au centre de la Terre",
                author: "Jules Verne",
                year: 1864,
                pages: 350,
                available: true,
            },
            {
                title: [
                    "Voyage au centre de la Terre",
                    "De la Terre à la Lune",
                    "L'Île mystérieuse",
                ],
                author: "Jules Verne",
                pages: 350,
                available: true,
            },
        ],
    },
};

let chaine = librairie.library.contact.email;

let nom = "";
for (let i = 0; i < chaine.length; i++) {
    if (chaine[i] === "@") {
        for (let j = i + 1; j < chaine.length; j++) {
            nom += chaine[j];
        }
    }
}

console.log(nom);

let obj = {
    totalBooks: 0,
    availableBooks: 0,
    unavailableBooks: 0,
};

let books = librairie.library.books;
for (let b of books) {
    obj["totalBooks"]++;

    if (b.available) {
        obj.availableBooks++;
    } else {
        obj.unavailableBooks++;
    }
}

console.log(obj);

let max = 0;
let idx = 0;
for (let i = 0; i < books.length; i++) {
    if (max < books[i].pages) {
        max = books[i].pages;
        idx = i;
    }
}

console.log(books[idx]);

let tab = [];
for (let i = 0; i < books.length; i++) {
    if (typeof books[i].year !== "number") {
        tab.push(books[i]);
    }
}

console.log(tab);

let rs = books.reduce((acc, b) => {
    if (Array.isArray(b.title)) {
        b.title.map((e) => acc.push(e));
    } else {
        acc.push(b.title);
    }

    return acc;
}, []);

console.log(rs);

//  8. L'Extracteur de Contact (Object & String)

// المطلوب: جبد ليا غير السمية ديال الـ Domaine ديال المكتبة من الإيمايل ديالهم
// (يعني داكشي لي مورا الـ @، لي هو "bibliotheque.fr").

// القالب: غتخدم على librairie.library.contact.email وتستعمل بوكل for باش تاخذ غير الحروف لي مورا @.
