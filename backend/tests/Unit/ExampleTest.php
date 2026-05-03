<?php

// 5. Compte Bancaire Sécurisé (Encapsulation & Exceptions)
// Contexte : Un système bancaire qui empêche les fraudes.
// Cahier des charges :

// Créez un CompteBancaire avec un solde privé.

class CompteBancaire
{
    protected float $solde;


    public function __construct(float $solde)
    {
        $this->solde = $solde;
    }



    public function getSolde(): float
    {
        return $this->solde;
    }

    public function retirer(float $monatant): bool
    {
        if ($monatant > $this->solde && $monatant < 0) {
            return false;
        } else {
            $this->solde -= $monatant;
            return true;
        }
    }


    public function deposer($monatant): bool
    {
        if ($this->solde += $monatant)
            return true;
        return false;
    }



}

class CompteVIP extends CompteBancaire
{

    public function retirer($monatant): bool
    {
        if ($monatant < -5000) {
            return false;
        } else {
            $this->solde -= $monatant;
            return true;
        }
    }
}

// Implémentez les méthodes deposer(montant) et retirer(montant).

// Règle absolue : Le solde ne doit jamais devenir négatif. Si un retrait dépasse le solde, 
// le programme doit bloquer l'action proprement (pas de simple echo,
//  réfléchissez à une approche plus robuste).

// Créez un CompteVIP qui autorise un découvert (solde négatif) jusqu'à -5000 DHS.




// 0. Tournoi E-Sport (Héritage, Agrégation & Interfaces)
// Contexte : Gestion d'un tournoi de jeux compétitifs.
// Cahier des charges :

// Créez une classe Equipe et une classe Joueur.

class Equipe
{

}

class Joueur 
{
    protected string $pseudo;

    public function __construct(string $pseudo)
    {
        $this->pseudo = $pseudo;
    }
 }

 class Capitaines extends Joueur
 {
    public function __construct(string $pseudo)
    {
        return parent::__construct($pseudo);
    }
 }

 





// L'équipe est une agrégation de joueurs (un joueur peut changer d'équipe).

// Tous les joueurs ont un pseudo, mais certains sont des "Capitaines".
//  Les capitaines ont la responsabilité exclusive de valider les stratégies (contrat spécifique).

// Créez un Match qui oppose deux équipes et affiche les capitaines respectifs avant de lancer la partie.


//  2. Capteurs de Ville Intelligente (Interfaces & Static)
// Contexte : Gérez les capteurs d'une Smart City.
// Cahier des charges :

// Créez des capteurs de type CapteurTrafic et CapteurQualiteAir.

// Tous les capteurs doivent obligatoirement posséder une méthode transmettreDonnees().

// Le système doit garder une trace exacte du nombre total de capteurs déployés dans la ville,
//  peu importe leur type, accessible sans instancier de capteur.
// Créez un gestionnaire qui prend une liste de capteurs et déclenche leur transmission.


// 4. Gestionnaire de Fichiers Multimédias (Abstraction & Polymorphisme)
// Contexte : Un explorateur de fichiers (File Manager).
// Cahier des charges :

// Gérez des FichierTexte, FichierVideo, et FichierImage.

// On ne peut pas créer un "Fichier" générique. Tout fichier a un nom et une taille.

// La méthode lire() doit se comporter différemment : le texte affiche son contenu, la vidéo affiche "Lecture vidéo...", l'image affiche "Aperçu de l'image...".

// Créez un Dossier qui peut contenir n'importe quel type de fichier et qui possède une méthode lireTout().



abstract class Fichier
{
    protected string $nom ;
    protected float $taille ;

    public function __construct(string $nom ,float $taile)
    {
        $this->nom = $nom;
        $this->taille = $taile;
    }

   abstract public function lire();
}



class Texte extends Fichier
{

    private string $contenu;
    public function __construct(string $nom ,string $contenu,float $taille)
    {
        parent::__construct($nom, $taille);
        $this->contenu = $contenu;
    }


    public function lire()
    {
        echo 'le contenu est : '.$this->contenu . '.';
    }
}


class Video extends Fichier
{

     public function __construct(string $nom ,  float $taille)
    {
        parent::__construct($nom, $taille);
     }


    public function lire()
    {
        echo 'Lecture  de   Video'.$this->nom.' la taille est '.$this->taille;
    }
}



class Image extends Fichier
{

     public function __construct(string $nom ,float $taille)
    {
        parent::__construct($nom, $taille);
     }


    public function lire()
    {
        echo 'Aperçu de l\'image'.$this->nom.' la taille est '.$this->taille;
    }
}

class Dossier 
{
    private array $fichieres = [];

    public function __construct()
    {

    }


    public function ajouteFichier(Fichier $fichier)
    {
        $this->fichieres[] = $fichier;
    }


    public function lireTout()
    {
        foreach($this->fichieres as $f)
            {
                $f->lire();
            }
    }
}




// bjectif : Créer une interface pour gérer différents types de paiement.

// Créez une interface PaiementInterface qui possède une méthode payer($montant).

// Créez deux classes : CarteBancaire et PayPal qui implémentent cette interface.

// CarteBancaire::payer($montant) doit afficher : "Paiement de X€ par Carte Bancaire".

// PayPal::payer($montant) doit afficher : "Paiement de X€ via PayPal".

// Créez une fonction traiterAchat($moyenDePaiement, $montant) qui accepte n'importe quel objet implémentant l'interface et appelle la méthode payer().
