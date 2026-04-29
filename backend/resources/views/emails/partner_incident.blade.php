<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.5; background-color: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #ccc; border-top: 5px solid #1e3a8a; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .header h2 { margin: 0; color: #1e3a8a; font-size: 20px; text-transform: uppercase; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
        .info-table th, .info-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        .info-table th { background-color: #f5f5f5; width: 30%; font-weight: bold; }
        .section-title { font-weight: bold; font-size: 16px; margin-top: 25px; margin-bottom: 10px; color: #1e3a8a; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .desc-box { background: #fdfdfd; padding: 15px; border-left: 4px solid #1e3a8a; color: #444; font-style: italic; font-size: 14px; }
        .contact-box { background: #eef2ff; padding: 15px; border: 1px dashed #1e3a8a; margin-top: 25px; text-align: center; font-size: 14px; }
        .footer { text-align: center; font-size: 11px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
        .audio-btn { display: inline-block; background: #f59e0b; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Ordre d'Intervention</h2>
            <p style="margin: 5px 0 0; color: #555; font-size: 14px;">Référence : <strong>{{ $incident->ref_num }}</strong></p>
        </div>

        <p>Bonjour l'équipe <strong>{{ $partner->name }}</strong>,</p>
        <p>Veuillez trouver ci-dessous les détails d'un nouvel incident signalé dans votre secteur :</p>

        <table class="info-table">
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
                        <div style="margin-bottom: 15px; text-align: center;">
                            <img src="{{ $media->file_path }}" alt="Preuve Visuelle" style="max-width: 100%; height: auto; border: 2px solid #ddd; padding: 4px;">
                        </div>
                    @endif

                    {{-- Affichage de l'Audio --}}
                    @if($media->file_type === 'audio')
                        <div style="margin-bottom: 15px; text-align: center;">
                            <a href="{{ $media->file_path }}" target="_blank" class="audio-btn">
                               Cliquez ici pour écouter l'enregistrement vocal
                            </a>
                        </div>
                    @endif

                @endforeach
            </div>
        @endif

        <div class="contact-box">
            <strong>Contact Responsable :</strong> {{ $manager->first_name }} {{ $manager->last_name }}<br>
            <span style="font-size: 12px; color: #555;">Répondez directement à cet email pour le contacter.</span>
        </div>

        <div class="footer">
            Document généré automatiquement par la plateforme <strong>SafiPulse</strong>.<br>
            Merci de votre réactivité.
        </div>
    </div>
</body>
</html>