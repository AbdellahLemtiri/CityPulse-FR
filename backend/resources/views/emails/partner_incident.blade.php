<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #000000;
            background-color: #ffffff;
            font-size: 14px;
            margin: 20px;
        }

        .container {
            width: 650px;
            margin: 0 auto;
            border: 1px solid #000000;
            padding: 15px;
        }

        .header {
            text-align: center;
            border-bottom: 1px solid #000000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        h2 {
            margin: 0;
            font-size: 22px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #000000;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #cccccc;
            width: 30%;
        }

        .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
            text-decoration: underline;
        }

        .desc-box {
            border: 1px solid #000000;
            padding: 10px;
            margin-top: 5px;
        }

        .contact-box {
            border: 1px dashed #000000;
            background-color: #f0f0f0;
            padding: 10px;
            margin-top: 20px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 30px;
            border-top: 1px solid #000000;
            padding-top: 10px;
        }

        a {
            color: #0000EE;
            text-decoration: underline;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>ORDRE D'INTERVENTION</h2>
            <p>Référence : <strong>{{ $incident->ref_num }}</strong></p>
        </div>

        <p>Bonjour l'équipe <strong>{{ $partner->name }}</strong>,</p>
        <p>Veuillez trouver ci-dessous les détails d'un nouvel incident signalé dans votre secteur :</p>

        <table>
            <tr>
                <th>Catégorie</th>
                <td>{{ $incident->category->name }}</td>
            </tr>
            <tr>
                <th>Problème</th>
                <td>{{ $incident->title }}</td>
            </tr>
            <tr>
                <th>Adresse</th>
                <td>{{ $incident->address }}</td>
            </tr>
            <tr>
                <th>Délai (SLA)</th>
                <td style="color: red; font-weight: bold;">{{ $partner->sla_hours }} heures</td>
            </tr>
        </table>

        <div class="section-title">Description Citoyenne</div>
        <div class="desc-box">
            {{ $incident->description ?? 'Aucune description textuelle fournie.' }}
        </div>

        @if($incident->media && $incident->media->count() > 0)
        <div class="section-title">Pièces Jointes (Preuves)</div>
        <div style="margin-top: 10px;">
            @foreach ($incident->media as $media)

            {{-- Affichage de l'Image --}}
            @if($media->file_type === 'image')
            <div style="margin-bottom: 15px;">
                <img src="{{ $media->file_path }}" alt="Preuve Visuelle" style="width: 400px; border: 1px solid #000000;">
            </div>
            @endif

            {{-- Affichage de l'Audio --}}
            @if($media->file_type === 'audio')
            <div style="margin-bottom: 15px;">
                <a href="{{ $media->file_path }}" target="_blank">
                    [Ouvrir l'enregistrement vocal]
                </a>
            </div>
            @endif

            @endforeach
        </div>
        @endif

        <div class="contact-box">
            <strong>Contact Responsable :</strong> {{ $manager->first_name }} {{ $manager->last_name }}<br>
            Répondez directement à cet email pour le contacter.

            <div class="contact-box">
                <strong>email de Responsable :</strong> {{ $manager->email }}<br>
            </div>
            <div class="contact-box">
                <strong>phone de Responsable :</strong> {{ $manager->phone }} <br>
            </div>
        </div>

        <strong>SafiPulse</strong>.<br>
        Merci de votre réactivité.

    </div>
</body>

</html>