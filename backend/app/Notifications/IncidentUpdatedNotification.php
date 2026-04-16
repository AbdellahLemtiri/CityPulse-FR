<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

 class IncidentUpdatedNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $incidentData;

    public function __construct($incidentData)
    {
        $this->incidentData = $incidentData;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'incident_id' => $this->incidentData['id'],
            'title' => $this->incidentData['title'],
            'message' => 'Votre incident a été mis à jour.',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'incident_id' => $this->incidentData['id'],
            'title' => $this->incidentData['title'],
            'message' => 'Votre incident a été mis à jour.',
        ]);
    }
}
