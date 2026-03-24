<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
        //
        return [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)->letters()->numbers()->symbols()],
            'cin' => 'required|string',
            'telephone' => 'required|string',
            'sector_id' => 'required|integer|exists:sectors,id',
            'adresse' => 'nullable|string',
        ];
    }
}
