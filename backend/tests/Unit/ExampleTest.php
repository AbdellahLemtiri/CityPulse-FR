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


 