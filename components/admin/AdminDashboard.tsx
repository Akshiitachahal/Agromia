'use client';

import { FormEvent, useEffect, useState } from 'react';

type Range = { id: string; slug: string; translations: { name: string; description?: string | null }[]; isActive: boolean; _count?: { products: number } };
type Product = { id: string; slug: string; isPublished: boolean; isFeatured: boolean; translations: { name: string }[]; category: { slug: string; translations: { name: string }[] } };

export default function AdminDashboard() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [rangeForm, setRangeForm] = useState({ name: '', slug: '', description: '' });
  const [productForm, setProductForm] = useState({ name: '', slug: '', categoryId: '', shortDescription: '' });
  const [message, setMessage] = useState('');

  async function load() {
    const [rangesResponse, productsResponse] = await Promise.all([fetch('/api/admin/product-ranges'), fetch('/api/admin/products')]);
    if (rangesResponse.ok) setRanges(await rangesResponse.json());
    if (productsResponse.ok) setProducts(await productsResponse.json());
  }

  useEffect(() => { load(); }, []);

  async function createRange(event: FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/admin/product-ranges', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rangeForm) });
    setMessage(response.ok ? 'Product range saved.' : 'Unable to save product range.');
    if (response.ok) { setRangeForm({ name: '', slug: '', description: '' }); load(); }
  }

  async function createProduct(event: FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...productForm, isPublished: false }) });
    setMessage(response.ok ? 'Product saved.' : 'Unable to save product.');
    if (response.ok) { setProductForm({ name: '', slug: '', categoryId: '', shortDescription: '' }); load(); }
  }

  return (
    <main className="container-brand py-16">
      <header className="mb-12">
        <span className="section-label">AGROMIA / ADMIN</span>
        <h1 className="text-display-editorial text-charcoal mt-4">Product portfolio</h1>
        {message && <p className="mt-3 text-sm text-forest">{message}</p>}
      </header>
      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-heading-editorial text-charcoal mb-5">Product ranges</h2>
          <form onSubmit={createRange} className="space-y-3 bg-white p-6 mb-6">
            <input required placeholder="Range name" value={rangeForm.name} onChange={(e) => setRangeForm({ ...rangeForm, name: e.target.value })} className="form-input-editorial" />
            <input required placeholder="Slug" value={rangeForm.slug} onChange={(e) => setRangeForm({ ...rangeForm, slug: e.target.value })} className="form-input-editorial" />
            <textarea placeholder="Short description" value={rangeForm.description} onChange={(e) => setRangeForm({ ...rangeForm, description: e.target.value })} className="form-input-editorial min-h-24" />
            <button className="btn btn-primary">Add range</button>
          </form>
          <ul className="space-y-2">{ranges.map((range) => <li key={range.id} className="border-b border-charcoal/15 py-3 flex justify-between"><span>{range.translations[0]?.name || range.slug}</span><small>{range._count?.products || 0} products</small></li>)}</ul>
        </section>
        <section>
          <h2 className="text-heading-editorial text-charcoal mb-5">Products</h2>
          <form onSubmit={createProduct} className="space-y-3 bg-white p-6 mb-6">
            <input required placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="form-input-editorial" />
            <input required placeholder="Slug" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} className="form-input-editorial" />
            <select required value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} className="form-input-editorial"><option value="">Choose a range</option>{ranges.map((range) => <option key={range.id} value={range.id}>{range.translations[0]?.name || range.slug}</option>)}</select>
            <textarea placeholder="Short description" value={productForm.shortDescription} onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })} className="form-input-editorial min-h-24" />
            <button className="btn btn-primary">Add product</button>
          </form>
          <ul className="space-y-2">{products.map((product) => <li key={product.id} className="border-b border-charcoal/15 py-3 flex justify-between"><span>{product.translations[0]?.name || product.slug}</span><small>{product.isPublished ? 'Published' : 'Draft'}</small></li>)}</ul>
        </section>
      </div>
    </main>
  );
}
