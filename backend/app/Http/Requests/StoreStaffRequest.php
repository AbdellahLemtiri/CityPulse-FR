<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)->letters()->numbers()->symbols()],
            'role_id' => 'required|exists:roles,id',
            'sector_id' => 'sometimes|exists:sectors,id'
        ];
    }
}
