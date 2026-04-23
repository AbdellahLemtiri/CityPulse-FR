<<<<<<< HEAD
 <?php

    // cénario 1: Le Système de Domotique (Smart Home)
    // Hada fih l-fakh dyal l'Héritage vs Interface.

    // L-context: 3ndek wahed l-centrale dyal "Smart Home" li kat-t-tahakem f-les appareils (Lampes, Volets, Climatiseurs).

    // La contrainte: * Ga3 les appareils 3ndhom id wa status (on/off).

    // Certains appareils sont Dimmable (tqdar t-beddel lihom l-intensité bhal l-pola).

    // Certains sont Programmables (tqdar t-fixi lihom l-weqt bach i-t-tafaw).

    // Challenge POO: Kifach ghadi t-gérer wahed l-appareil li howa "Dimmer" wa "Programmable" f-nefs l-weqt? (sachant que l'héritage multiple f-PHP/Java ma-kainch).


    // abstract class Base 
    // {
    //  protected  int $id;
    //  protected  bool $status ;

    //  public function  __construct(int $id,bool $status ) 
    //  {
    //      $this->status = $status;
    //      $this->id = $id;
    //  }


    //  abstract public function smartHome():void;

    // }

    // class Lmape extends Base
    // {
    //     public function __construct()
    //     {
    //         parent::__construct();
    //     }

    //     public function smartHome():void
    //     {
    //         echo 'Lampe : id = '.$this->Id . 'status =' .$this->status;
    //     }
    // }


    // class Volets extends Base
    // {
    //       public function __construct()
    //     {
    //         parent::__construct();
    //     }
    //     public function smartHome():void
    //     {
    //         echo 'Volets';
    //     }
    // }



    // class Climatiseurs extends Base
    // {  public function __construct()
    //     {
    //         parent::__construct();
    //     }
    //     public function smartHome():void
    //     {
    //         echo 'Climatiseurs';
    //     }
    // }

    // $res = new Lmape(1,1);
    // echo $res;





    // echo "Try programiz.pro";


    // Contexte : Une entreprise IT souhaite automatiser le calcul des salaires de ses collaborateurs en respectant les principes de la POO.

    // Cahier des charges :

    // Le système doit gérer des employés. Tout employé possède obligatoirement un nom, un prénom et un salaire de base. Il est impossible d'instancier un simple "employé" générique.

    // abstract class Employe
    // {
    //     protected string $nom;
    //     protected string $prenom;
    //     protected float $salire;

    //     public function __construct(string $nom, string $prenom, float $salire)
    //     {
    //         $this->nom = $nom;
    //         $this->prenom = $prenom;
    //         $this->salire = $salire;
    //     }
    // }

    // class Developer extends Employe
    // {
    //     private float  $prime;

    //     public function __construct(string $nom, string $prenom, float $salire, float $prime)
    //     {
    //         return parent::__construct($nom, $prenom, $salire);
    //         $this->prime = $prime;
    //     }
    // }
    // class Manager extends Employe
    // {
    //     private float  $prime;
    //     public function __construct(string $nom, string $prenom, float $salire, float $prime)
    //     {
    //         return parent::__construct($nom, $prenom, $salire);
    //         $this->prime = $prime;
    //     }


    // }


    // Le salaire final d'un Développeur est son salaire de base majoré d'une prime fixe de 20%.

    // Le salaire final d'un Manager est son salaire de base auquel s'ajoute une prime de 500 DHS pour chaque Développeur qu'il supervise directement.

    // Un Manager doit donc avoir la capacité d'ajouter des Développeurs à son équipe.

    // Vous devez créer une entité Entreprise qui peut stocker l'ensemble de ses collaborateurs (tous types confondus).

    // Cette entité Entreprise doit posséder une méthode calculerMasseSalarialeTotale() qui calcule la somme exacte de tous les salaires finaux de l'entreprise en parcourant la liste de ses employés.

    // Exécution attendue : Écrivez un script qui crée deux Développeurs et un Manager. Assignez les deux développeurs au Manager. Ajoutez les trois collaborateurs à l'Entreprise, puis affichez la masse salariale totale.







    //  Cahier des charges :

    // Le système doit modéliser le concept de Plat. 
    // Il est impossible d'instancier un "plat" de manière générique. Tout plat possède un nom et un coût de fabrication (prix de base).

    // abstract class Plat
    // {
    //     protected string $nom;
    //     protected string $cout;
    //     protected int $prixDeBase;

    //     public function __construct(string $nom, string $cout, int $prixDeBase)
    //     {
    //         $this->nom = $nom;
    //         $this->cout = $cout;
    //         $this->prixDeBase = $prixDeBase;
    //     }

    //     abstract public function getPrixFinl(): float;
    // }

    // class PlatClasique extends Plat
    // {
    //     public function getPrixFinl(): float
    //     {
    //         return $this->prixDeBase + ($this->prixDeBase * 0.30);
    //     }
    // }




    // class PlatSignatures extends Plat
    // {
    //     public function getPrixFinl(): float
    //     {
    //         return $this->prixDeBase + ($this->prixDeBase * 0.50);
    //     }
    // }

    // class Menu
    // {
    //     private array $Plats = [];

    //     public function ajoutPlat(Plat $plat)
    //     {
    //         $this->Plats[] = $plat;
    //     }

    //     public function afficherCarte(): float
    //     {
    //         $total = 0;
    //         foreach ($this->Plats as $plat) {
    //             $total = $total +   $plat->getPrixFinl();
    //         }
    //         return $total;
    //     }
    // }


    // Le restaurant propose deux catégories de plats : les plats Classiques et les plats Signatures.
    // Le prix de vente d'un plat diffère selon sa catégorie :
    // Le prix de vente final d'un plat Classique correspond à son 
    // coût de fabrication majoré d'une marge de profit de 30%.
    // Le prix de vente final d'un plat Signature correspond à
    //  son coût de fabrication majoré d'une marge de 50%, à laquelle s'ajoute une surtaxe de prestige fixe de 50 DHS.

    // Vous devez concevoir une classe Menu qui permet de stocker la liste des plats proposés par le restaurant.

    // Cette classe Menu doit posséder une méthode afficherCarte() qui parcourt tous les plats de la liste et affiche pour chacun son nom suivi de son prix de vente final calculé dynamiquement.

    // Exécution attendue : Écrivez un script qui crée un plat classique, un plat signature, les ajoute au menu du restaurant, puis appelle la méthode pour afficher la carte complète.


    abstract class Message
    {
        protected string $contenu;

        public function __construct($contenu)
        {
            $this->contenu = $contenu;
        }

        abstract  function envoyer();
    }

    class MessageEmail extends Message
    {
        private string  $objet;

        public function __construct($objet)
        {
            $this->objet = $objet;
        }
        public function  getObjet(): string
        {
            return $this->objet;
        }
        public function envoyer()
        {
            echo "Email envoyer";
        }
    }

    class MessageSms extends
    {

        private string $numPhone;

        public function __construct($numPhone)
        {
            $this->numPhone = $numPhone;
        }
        public function  getNum(): string
        {
            return $this->numPhone;
        }

        public function envoyer()
        {
            echo "message envoyer";
        }
    }

    class NotificationManager
    {
         public function traiterMessage(Message $message)
        {
            if ($message instanceof MessageEmail) {
                echo 'Scan anti-spam du sujet : [' . $message->getObjet() . ']';
            }

            if ($message instanceof MessageSms) {
                echo 'Préparation du numéro de téléphone : [' . $message->getNum() . ']';
            }
            $message->envoyer();
        }
    }

    $message = new MessageSms('0604789190');
    $email = new MessageEmail('lemtiri@gmail.com');
    $notifcation = new NotificationManager();

    $notifcation->traiterMessage($message);



    ?>
=======
<?php
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8

