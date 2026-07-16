<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/themes/index', [
            'themes' => Theme::orderBy('sort_order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/themes/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'accent' => 'required|string',
            'image_url' => 'nullable|string|url',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        Theme::create($validated);

        return redirect()->route('admin.themes.index')->with('success', 'Theme created successfully.');
    }

    public function edit(Theme $theme)
    {
        return Inertia::render('admin/themes/edit', [
            'theme' => $theme,
        ]);
    }

    public function update(Request $request, Theme $theme)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'accent' => 'required|string',
            'image_url' => 'nullable|string|url',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $theme->update($validated);

        return redirect()->route('admin.themes.index')->with('success', 'Theme updated successfully.');
    }

    public function destroy(Theme $theme)
    {
        $theme->delete();

        return redirect()->route('admin.themes.index')->with('success', 'Theme deleted successfully.');
    }
}
