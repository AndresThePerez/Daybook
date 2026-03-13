<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class NotesRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'category_id' => 'required',
            'title' => ['required', Rule::unique('notes')->ignore($this->id)],
            'body' => 'required'
        ];
    }


    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'category.required' => 'The category field is required.',
            'title.required' => 'The requested note\'s title is required.',
            'title.unique' => 'The title of the note must be unique.',
            'body.required' => 'The body of the note is required.'
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'title' => strip_tags($this->title),
            'body' => strip_tags($this->body)
        ]);
    }
}
