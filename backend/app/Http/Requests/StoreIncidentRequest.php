<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
         return false;
    }

    public function rules(): array
    {
        return [      
            'title'       => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'address'     => 'nullable|string|max:255',
             'images'      => 'required|array|min:1|max:4',
            'images.*'    => 'required|image|mimes:jpeg,png,webp|max:5120',  
             'audio'       => 'nullable|file|mimes:mp3,wav,m4a,ogg|max:10240',  
        ];
    }

    public function messages(): array
    {
        return [
            'images.required'   => 'Vous devez joindre au moins une photo principale de l\'incident.',
            'images.min'        => 'Une image principale est requise.',
            'images.max'        => 'Vous ne pouvez pas envoyer plus de 4 photos.',
            'images.*.image'    => 'Le fichier fourni n\'est pas une image valide.',
            'images.*.mimes'    => 'Seuls les formats JPEG, PNG et WEBP sont acceptés.',
            'images.*.max'      => 'Chaque image ne doit pas dépasser 5 Mo.',
            'audio.mimes'       => 'Le format audio n\'est pas supporté.',
            'audio.max'         => 'La note vocale ne doit pas dépasser 10 Mo.',
         ];
    }
}