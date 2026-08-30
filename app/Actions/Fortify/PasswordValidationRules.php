<?php

namespace App\Actions\Fortify;

use Illuminate\Contracts\Validation\Rule;

trait PasswordValidationRules
{
    /**
     * Get the validation rules used to validate passwords.
     *
     * @return array<int, Rule|array<mixed>|string|callable>
     */
    protected function passwordRules(): array
    {
        return [
            'required',
            'string',
            'confirmed',
            function (string $attribute, mixed $value, \Closure $fail): void {
                $password = (string) $value;
                $errors = [];

                if (mb_strlen($password) < 8) {
                    $errors[] = 'The password must be at least 8 characters.';
                }

                if (! preg_match('/[A-Z]/', $password)) {
                    $errors[] = 'The password must include at least one uppercase letter.';
                }

                if (! preg_match('/[^A-Za-z0-9]/', $password)) {
                    $errors[] = 'The password must include at least one symbol.';
                }

                if ($errors !== []) {
                    $fail(implode(' ', $errors));
                }
            },
        ];
    }
}
