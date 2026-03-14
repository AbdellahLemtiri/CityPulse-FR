<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIncidentRequest extends FormRequest
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
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'sector_id' => 'required|exists:sectors,id', 
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'address' => 'nullable|string',
            'images_count' => 'integer|min:1|max:4',
            'hasAudio' => 'boolean default false',
            

        ];
    }
}
