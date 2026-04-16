<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
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
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'sector_id' => 'sometimes|exists:sectors,id',
            'status' => 'sometimes|in:draft,published',
            'deleted_images' => 'nullable|array', 
            'images.*' => 'image|max:5120', 
            'deleted_images.*' => 'string',
        ];
    }
}
