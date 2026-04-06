<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PartnerIncidentMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public  $partner;
    public $incident;
    public $manager;

    public function __construct($incident, $partner, $manager)
    {
        //

        $this->incident = $incident;
        $this->partner = $partner;
        $this->manager = $manager;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Partner Incident Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function build()
    {
        return $this->subject('Ordre d\'intervention : Nouvel Incident - CityPulse')
            ->replyTo($this->manager->email, $this->manager->name)
            ->view('emails.partner_incident');
    }
}
