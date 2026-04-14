<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width : 600px ;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        .header {
            background: #1e3a8a;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            padding: 20px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }

        .badge {
            background: #f59e0b;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>SafiPulse - Ordre d'Intervention</h2>
        </div>
        <div class="content">
            <p>Bonjour l'équipe <strong>{{ $partner->name }}</strong>,</p>
            <p>Un nouvel incident nécessite votre intervention dans votre secteur d'activité.</p>

            <ul>
                <li><strong>Référence :</strong> {{ $incident->ref_num }}</li>
                <li><strong>Catégorie :</strong> <span class="badge">{{ $incident->category->name }}</span></li>
                <li><strong>Problème :</strong> {{ $incident->title }}</li>
                <li><strong>Adresse :</strong> {{ $incident->address }}</li>
                <li><strong>Date de déclaration :</strong> {{ $incident->created_at->format('d/m/Y H:i') }}</li>
            </ul>

            <p><strong>Description citoyenne :</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #1e3a8a;">
                {{ $incident->description }}
            </blockquote>
            <p><strong>Description citoyenne :</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #1e3a8a;">
                {{ $incident->description }}
            </blockquote>
            <div style="background: #eef2ff; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 0;"><strong>Votre contact responsable :</strong></p>
                <p style="margin: 5px 0 0 0;">👤 {{ $manager->name }} (Manager de Secteur)</p>
                <p style="margin: 0;">✉️ Vous pouvez répondre directement à cet email pour le contacter.</p>
            </div>

            <p>Merci de prendre en charge ce ticket dans les délais convenus (SLA : {{ $partner->sla_hours }}h).</p>
        </div>

        <p>Merci de prendre en charge ce ticket dans les délais convenus (SLA : {{ $partner->sla_hours }}h).</p>
    </div>
    <div class="footer">
        Ceci est un message automatique généré par la plateforme SafiPulse.
    </div>
    </div>
</body>

</html>