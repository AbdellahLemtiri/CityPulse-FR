<?php

namespace App\Http\Requests\comment;

use Illuminate\Foundation\Http\FormRequest;

class getCommentRequest extends FormRequest
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
            'commentable_type' => 'required|string|in:Article,Post,comment',
            'commentable_id'   => 'required|integer',
        ];
    }
}
