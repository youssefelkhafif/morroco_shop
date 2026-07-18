<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/collections/index', [
            'collections' => Collection::orderBy('sort_order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/collections/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'badge' => 'required|string|max:255',
            'image' => 'nullable|image|max:4096',
            'image_url' => 'nullable|string|url',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        Collection::create($validated);

        return redirect()->route('admin.collections.index')->with('success', 'Collection created successfully.');
    }

    public function edit(Collection $collection)
    {
        return Inertia::render('admin/collections/edit', [
            'collection' => $collection,
        ]);
    }

    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string',
            'badge' => 'required|string|max:255',
            'image' => 'nullable|image|max:4096',
            'image_url' => 'nullable|string|url',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $validated['image_url'] = Storage::url($path);
        }

        $collection->update($validated);

        return redirect()->route('admin.collections.index')->with('success', 'Collection updated successfully.');
    }

    public function destroy(Collection $collection)
    {
        $collection->delete();

        return redirect()->route('admin.collections.index')->with('success', 'Collection deleted successfully.');
    }
}
