// nversion manuelle : Qleb mot bla reverse() (Khedmnaha 9bila, tktbha wnta mghmmed!).

function reverse(chaine) {
    let mot = "";

    for (let i = chaine.length - 1; i >= 0; i--) {
        mot += chaine[i];
    }
    return mot;
}

console.log(reverse("laravel-11"));

// Le Palindrome : T2eked wach l'mot kaytqra mn limen b7al mn liser (b7al "radar").

function testPalandrom(chaine) {
    if (reverse(chaine) === chaine) {
        return true;
    } else {
        return false;
    }
}
console.log(testPalandrom("laravel"));

// Mot le plus long : Jbed l'mot li fih akbar 3adad dyal l'7rouf f phrase.

function Bonjour(chaine) {
    let tmp = chaine.split(" ");
    let pr = tmp[1][0].toUpperCase();
    let motFinale = "Bonjour" + " " + pr + "." + tmp[0];
    return motFinale;
}
console.log(Bonjour("abdelah lemtiri"));

// Fréquence des caractères : Jbed l'7erf li m3awed bezaf f wahed l'mot (Khedmnaha 9bila b for imbriquées).

function letrePlusUtile(chaine) {
    let rs = chaine.split("");
    let plus = ''
    

}

// Premier caractère unique : Jbed awel 7erf li makayt3awedch ga3 f l'mot (Entrée: "aabbcdd" ➡️ Sortie: "c").

// Suppression des doublons absolus : Khli ghir nsikha we7da mn kola 7erf (Entrée: "hello" ➡️ Sortie: "helo").

// Sous-chaîne manuelle (Substring) : Sawb fonction katakhod mot, debut, w fin, w katreje3 lik ghir dak l'morsso (bla ma tst3mel .slice()).

// 🔴 Niveau Difficile (Les Algorithmes d'Entretiens - FAANG)
// Compression de chaîne : Entrée: "aaabbc" ➡️ Sortie: "a3b2c1" (Khedmnaha 9bila).

// Anagrammes : T2eked wach zouj dyal l'mots fihom nafs l'7rouf b dbt (Entrée: "listen", "silent" ➡️ true).

// Rotation de chaîne : T2eked wach l'mot الثاني houwa ghir rotation dyal l'mot الأول (Entrée: "waterbottle", "erbottlewat" ➡️ true).

// La plus longue sous-chaîne sans répétition : Jbed atwel partie f string li mafiha ta 7erf m3awed (Entrée: "abcabcbb" ➡️ Sortie: "abc" - Hada s3iiiib).

// Validation des parenthèses : T2eked wach ga3 les parenthèses awla les accolades msdoudin mzyan (Entrée: "{[()]}" ➡️ true, "{[(])}" ➡️ false).

// Implémentation de .includes() pour une phrase : T2eked wach wahed l'mot kamel kayn وسط wahed la phrase (bla ma tst3mel les méthodes wajdin, khassk tqaren string m3a string 7erf b 7erf).
