<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncidentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:200',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'sector_id' => 'sometimes|exists:sectors,id',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'address' => 'sometimes|string',
            'images_count' => 'sometimes|min:1|max:4',
            'hasAudio' => 'sometimes | boolean default false'

        ];
    }

    
}
