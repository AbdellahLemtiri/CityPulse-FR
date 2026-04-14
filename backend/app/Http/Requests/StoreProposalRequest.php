<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProposalRequest extends FormRequest
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

            'description' => 'required|string|max:255|min:3',
            'location_name' => 'required|string|max:255|min:3',
            'images.*' => 'sometimes|image|mimes:jpeg,png,webp,jpg|max:5120 ',
         ];
    }
}
