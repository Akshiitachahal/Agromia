'use client';

import { FormEvent, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

type LocaleKey = 'en' | 'hi' | 'har';
type Translation = { name: string; shortDescription: string; composition: string; formulation: string; benefits: string; targetCrops: string; targetPests: string; dosage: string; applicationMethod: string; packaging: string; technicalInfo: string; recommendation: string };
type Range = { id: string; slug: string; isActive: boolean; translations: { locale: string; name: string; description?: string | null }[]; _count?: { products: number } };
type Product = { id: string; slug: string; categoryId: string; primaryImageUrl?: string | null; isPublished: boolean; isFeatured: boolean; displayOrder: number; translations: (Translation & { locale: string })[]; images: { id: string; url: string; altText?: string | null }[]; brochures: { url: string }[] };
type Director = { id: string; imageUrl?: string | null; displayOrder: number; isActive: boolean; translations: { locale: string; name: string; designation: string; bio?: string | null }[] };

const blankTranslation = (): Translation => ({ name: '', shortDescription: '', composition: '', formulation: '', benefits: '', targetCrops: '', targetPests: '', dosage: '', applicationMethod: '', packaging: '', technicalInfo: '', recommendation: '' });
const blankProduct = () => ({ id: '', slug: '', categoryId: '', primaryImageUrl: null as string | null, isPublished: false, isFeatured: false, displayOrder: 0, translations: { en: blankTranslation(), hi: blankTranslation(), har: blankTranslation() }, images: [] as { id: string; url: string; altText?: string | null }[] });

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminDashboard() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [director, setDirector] = useState({ id: '', name: '', designation: '', bio: '', displayOrder: 0, isActive: true, imageUrl: '' });
  const [range, setRange] = useState({ id: '', slug: '', displayOrder: 0, isActive: true, translations: { en: { name: '', description: '' }, hi: { name: '', description: '' }, har: { name: '', description: '' } } });
  const [product, setProduct] = useState(blankProduct());
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    const response = await fetch('/api/admin/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: password.currentPassword, newPassword: password.newPassword }),
    });
    const body = await response.json();
    setMessage(response.ok ? 'Password changed successfully.' : body.error || 'Unable to change password.');
    if (response.ok) setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  async function load() {
    const [rangeResponse, productResponse, directorResponse] = await Promise.all([
      fetch('/api/admin/product-ranges'),
      fetch('/api/admin/products'),
      fetch('/api/admin/directors'),
    ]);
    if (rangeResponse.ok) setRanges(await rangeResponse.json());
    if (productResponse.ok) setProducts(await productResponse.json());
    if (directorResponse.ok) setDirectors(await directorResponse.json());
  }
  useEffect(() => { load(); }, []);

  const updateProductTranslation = (locale: LocaleKey, field: keyof Translation, value: string) => setProduct((current) => ({ ...current, translations: { ...current.translations, [locale]: { ...current.translations[locale], [field]: value } } }));
  const updateRangeTranslation = (locale: LocaleKey, field: 'name' | 'description', value: string) => setRange((current) => ({ ...current, translations: { ...current.translations, [locale]: { ...current.translations[locale], [field]: value } } }));

  async function saveRange(event: FormEvent) {
    event.preventDefault();
    const { id, ...payload } = range;
    const response = await fetch(id ? `/api/admin/product-ranges/${id}` : '/api/admin/product-ranges', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setMessage(response.ok ? 'Product range saved.' : 'Unable to save product range.');
    if (response.ok) { setRange({ id: '', slug: '', displayOrder: 0, isActive: true, translations: { en: { name: '', description: '' }, hi: { name: '', description: '' }, har: { name: '', description: '' } } }); load(); }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    const { id, ...payload } = product;
    const response = await fetch(id ? `/api/admin/products/${id}` : '/api/admin/products', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setMessage(response.ok ? 'Product saved.' : 'Unable to save product.');
    if (response.ok) { setProduct(blankProduct()); load(); }
  }

  async function updateStatus(path: string, body: object) { const response = await fetch(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); setMessage(response.ok ? 'Updated.' : 'Unable to update.'); if (response.ok) load(); }
  async function archive(path: string) { const response = await fetch(path, { method: 'DELETE' }); setMessage(response.ok ? 'Archived.' : 'Unable to archive.'); if (response.ok) load(); }

  async function saveDirector(event: FormEvent) {
    event.preventDefault();
    const { id, ...payload } = director;
    const response = await fetch(id ? `/api/admin/directors/${id}` : '/api/admin/directors', {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setMessage(response.ok ? 'Leadership profile saved.' : 'Unable to save leadership profile.');
    if (response.ok) {
      setDirector({ id: '', name: '', designation: '', bio: '', displayOrder: 0, isActive: true, imageUrl: '' });
      load();
    }
  }
  async function upload(file: File, entityType: string, entityId: string) {
    const form = new FormData();
    form.set('file', file);
    form.set('entityType', entityType);
    form.set('entityId', entityId);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setMessage(body?.error || 'Upload failed.');
      return;
    }
    const asset = await response.json();
    if (entityType === 'product' && asset.secure_url) setProduct((current) => ({
      ...current,
      primaryImageUrl: current.primaryImageUrl || current.images[0]?.url || asset.secure_url,
      images: [...current.images, { id: `uploaded-${Date.now()}-${current.images.length}`, url: asset.secure_url, altText: file.name }],
    }));
    if (entityType === 'director' && asset.secure_url) setDirector((current) => ({ ...current, imageUrl: asset.secure_url }));
    setMessage('Asset uploaded.');
    load();
  }

  async function uploadFiles(files: FileList, entityType: string, entityId: string) {
    for (const file of Array.from(files)) {
      await upload(file, entityType, entityId);
    }
  }

  const productFields: (keyof Translation)[] = ['shortDescription', 'composition', 'formulation', 'benefits', 'targetCrops', 'targetPests', 'dosage', 'applicationMethod', 'packaging', 'technicalInfo', 'recommendation'];

  return (
    <main className="container-brand py-16">
      <header className="mb-12 flex flex-wrap items-start justify-between gap-4"><div><span className="section-label">AGROMIA / ADMIN</span><h1 className="text-display-editorial text-charcoal mt-4">Content dashboard</h1>{message && <p className="mt-3 text-sm text-forest">{message}</p>}</div><button type="button" onClick={() => signOut({ callbackUrl: '/admin/login' })} className="btn btn-primary">Sign out</button></header>
      <section className="mb-12">
        <h2 className="text-heading-editorial text-charcoal mb-5">Change password</h2>
        <form onSubmit={changePassword} className="grid gap-3 bg-white p-6 sm:grid-cols-3">
          <input type="password" required placeholder="Current password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} className="form-input-editorial" />
          <input type="password" required minLength={8} placeholder="New password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} className="form-input-editorial" />
          <input type="password" required minLength={8} placeholder="Confirm new password" value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} className="form-input-editorial" />
          <button type="submit" className="btn btn-primary sm:col-span-3 justify-center">Change password</button>
        </form>
      </section>
      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-heading-editorial text-charcoal mb-5">Product ranges</h2>
          <form onSubmit={saveRange} className="space-y-3 bg-white p-6 mb-6">
            <div>
              <label className="block text-xs text-muted-gray mb-1">Range slug — a URL name such as `fungicides`</label>
              <div className="flex gap-2">
                <input required placeholder="e.g. fungicides" value={range.slug} onChange={(e) => setRange({ ...range, slug: slugify(e.target.value) })} className="form-input-editorial" />
                <button type="button" className="btn btn-primary" onClick={() => setRange((current) => ({ ...current, slug: slugify(current.translations.en.name) }))}>Create from name</button>
              </div>
              <p className="mt-1 text-xs text-muted-gray">Use lowercase English letters and hyphens. A slug becomes the public link: `/products/fungicides`.</p>
            </div>
            {(['en', 'hi', 'har'] as LocaleKey[]).map((locale) => <div key={locale} className="space-y-2"><input required={locale === 'en'} placeholder={`${locale.toUpperCase()} range name`} value={range.translations[locale].name} onChange={(e) => updateRangeTranslation(locale, 'name', e.target.value)} className="form-input-editorial" /><textarea placeholder={`${locale.toUpperCase()} description`} value={range.translations[locale].description} onChange={(e) => updateRangeTranslation(locale, 'description', e.target.value)} className="form-input-editorial" /></div>)}
            <div className="flex gap-4"><input type="number" min="0" value={range.displayOrder} onChange={(e) => setRange({ ...range, displayOrder: Number(e.target.value) })} className="form-input-editorial" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={range.isActive} onChange={(e) => setRange({ ...range, isActive: e.target.checked })} /> Published</label></div>
            <button className="btn btn-primary">{range.id ? 'Save range' : 'Add range'}</button>
            {range.id && <label className="block text-sm">Range image<input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'category', range.id)} className="mt-2 block" /></label>}
          </form>
          <ul className="space-y-2">{ranges.map((item) => <li key={item.id} className="border-b border-charcoal/15 py-3 flex items-center justify-between gap-3"><button className="text-left" onClick={() => setRange({ id: item.id, slug: item.slug, displayOrder: 0, isActive: item.isActive, translations: { en: { name: item.translations.find((x) => x.locale === 'EN')?.name || '', description: item.translations.find((x) => x.locale === 'EN')?.description || '' }, hi: { name: item.translations.find((x) => x.locale === 'HI')?.name || '', description: item.translations.find((x) => x.locale === 'HI')?.description || '' }, har: { name: item.translations.find((x) => x.locale === 'HAR')?.name || '', description: item.translations.find((x) => x.locale === 'HAR')?.description || '' } } })}>{item.translations.find((x) => x.locale === 'EN')?.name || item.slug}</button><span className="flex gap-2 text-xs"><button onClick={() => updateStatus(`/api/admin/product-ranges/${item.id}`, { isActive: !item.isActive })}>{item.isActive ? 'Unpublish' : 'Publish'}</button><button onClick={() => archive(`/api/admin/product-ranges/${item.id}`)}>Archive</button></span></li>)}</ul>
        </section>
        <section>
          <h2 className="text-heading-editorial text-charcoal mb-5">Products</h2>
          <form onSubmit={saveProduct} className="space-y-3 bg-white p-6 mb-6">
            <div>
              <label className="block text-xs text-muted-gray mb-1">Product slug — a URL name such as `agromia-proshield`</label>
              <div className="flex gap-2">
                <input required placeholder="e.g. agromia-proshield" value={product.slug} onChange={(e) => setProduct({ ...product, slug: slugify(e.target.value) })} className="form-input-editorial" />
                {product.translations.en.name && <button type="button" className="btn btn-primary" onClick={() => setProduct((current) => ({ ...current, slug: slugify(current.translations.en.name) }))}>Create from name</button>}
              </div>
              <p className="mt-1 text-xs text-muted-gray">The slug is permanent-friendly. Example: `/products/fungicides/agromia-proshield`. Do not use spaces or special characters.</p>
            </div>
            <select required value={product.categoryId} onChange={(e) => setProduct({ ...product, categoryId: e.target.value })} className="form-input-editorial"><option value="">Choose a range</option>{ranges.map((item) => <option key={item.id} value={item.id}>{item.translations.find((x) => x.locale === 'EN')?.name || item.slug}</option>)}</select>
            {(['en', 'hi', 'har'] as LocaleKey[]).map((locale) => <div key={locale} className="space-y-2 border-b border-charcoal/15 pb-3"><input required={locale === 'en'} placeholder={`${locale.toUpperCase()} product name`} value={product.translations[locale].name} onChange={(e) => updateProductTranslation(locale, 'name', e.target.value)} className="form-input-editorial" />{productFields.map((field) => <textarea key={field} placeholder={`${locale.toUpperCase()} ${field}`} value={product.translations[locale][field]} onChange={(e) => updateProductTranslation(locale, field, e.target.value)} className="form-input-editorial" />)}</div>)}
            <div className="flex flex-wrap gap-4 text-sm"><label><input type="number" min="0" value={product.displayOrder} onChange={(e) => setProduct({ ...product, displayOrder: Number(e.target.value) })} /> Order</label><label><input type="checkbox" checked={product.isPublished} onChange={(e) => setProduct({ ...product, isPublished: e.target.checked })} /> Published</label><label><input type="checkbox" checked={product.isFeatured} onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })} /> Featured</label></div>
            <button className="btn btn-primary">{product.id ? 'Save product' : 'Add product'}</button>
            {product.id && <div className="space-y-3 text-sm"><label className="block">Product pictures (select one or multiple from phone/laptop)<input type="file" accept="image/*" multiple onChange={(e) => e.target.files && uploadFiles(e.target.files, 'product', product.id)} className="mt-2 block" /></label><p className="text-xs text-muted-gray">The first uploaded picture becomes the main product picture. You can select several files together.</p>{product.images.length > 0 && <div className="flex flex-wrap gap-3">{product.images.map((image) => <div key={image.id} role="img" aria-label={image.altText || 'Product picture'} className="h-24 w-24 bg-contain bg-center bg-no-repeat border border-charcoal/15" style={{ backgroundImage: `url('${image.url}')` }} />)}</div>}<label className="block">Brochure PDF<input type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'brochure', product.id)} className="mt-2 block" /></label></div>}
          </form>
          <ul className="space-y-2">{products.map((item) => <li key={item.id} className="border-b border-charcoal/15 py-3 flex items-center justify-between gap-3"><button className="text-left" onClick={() => setProduct({ id: item.id, slug: item.slug, categoryId: item.categoryId, primaryImageUrl: item.primaryImageUrl || item.images[0]?.url || null, isPublished: item.isPublished, isFeatured: item.isFeatured, displayOrder: item.displayOrder, images: item.images, translations: { en: { ...blankTranslation(), ...(item.translations.find((x) => x.locale === 'EN') || {}) }, hi: { ...blankTranslation(), ...(item.translations.find((x) => x.locale === 'HI') || {}) }, har: { ...blankTranslation(), ...(item.translations.find((x) => x.locale === 'HAR') || {}) } } })}>{item.translations.find((x) => x.locale === 'EN')?.name || item.slug}</button><span className="flex gap-2 text-xs"><button onClick={() => updateStatus(`/api/admin/products/${item.id}`, { isPublished: !item.isPublished })}>{item.isPublished ? 'Unpublish' : 'Publish'}</button><button onClick={() => updateStatus(`/api/admin/products/${item.id}`, { isFeatured: !item.isFeatured })}>{item.isFeatured ? 'Unfeature' : 'Feature'}</button><button onClick={() => archive(`/api/admin/products/${item.id}`)}>Archive</button></span></li>)}</ul>
        </section>
      </div>
      <section className="mt-12">
        <h2 className="text-heading-editorial text-charcoal mb-5">Leadership</h2>
        <form onSubmit={saveDirector} className="space-y-3 bg-white p-6 mb-6">
          <input required placeholder="Name" value={director.name} onChange={(e) => setDirector({ ...director, name: e.target.value })} className="form-input-editorial" />
          <input required placeholder="Designation" value={director.designation} onChange={(e) => setDirector({ ...director, designation: e.target.value })} className="form-input-editorial" />
          <textarea placeholder="Bio" value={director.bio} onChange={(e) => setDirector({ ...director, bio: e.target.value })} className="form-input-editorial" />
          <div className="flex flex-wrap gap-4 text-sm">
            <label><input type="number" min="0" value={director.displayOrder} onChange={(e) => setDirector({ ...director, displayOrder: Number(e.target.value) })} /> Order</label>
            <label><input type="checkbox" checked={director.isActive} onChange={(e) => setDirector({ ...director, isActive: e.target.checked })} /> Published</label>
          </div>
          <button className="btn btn-primary">{director.id ? 'Save profile' : 'Add profile'}</button>
          {director.id && (
            <div className="space-y-2 text-sm">
              <label className="block">Leadership person picture
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'director', director.id)} className="mt-2 block" />
              </label>
              {director.imageUrl && <div role="img" aria-label="Current leadership portrait" className="h-32 w-32 bg-cover bg-center border border-charcoal/15" style={{ backgroundImage: `url('${director.imageUrl}')` }} />}
            </div>
          )}
        </form>
        <ul className="space-y-2">
          {directors.map((item) => (
            <li key={item.id} className="border-b border-charcoal/15 py-3 flex items-center justify-between gap-3">
              <button className="text-left" onClick={() => setDirector({
                id: item.id,
                name: item.translations.find((x) => x.locale === 'EN')?.name || '',
                designation: item.translations.find((x) => x.locale === 'EN')?.designation || '',
                bio: item.translations.find((x) => x.locale === 'EN')?.bio || '',
                displayOrder: item.displayOrder,
                isActive: item.isActive,
                imageUrl: item.imageUrl || '',
              })}>
                {item.translations.find((x) => x.locale === 'EN')?.name || 'Leadership profile'}
              </button>
              <span className="flex gap-2 text-xs">
                <button onClick={() => updateStatus(`/api/admin/directors/${item.id}`, { isActive: !item.isActive })}>{item.isActive ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => archive(`/api/admin/directors/${item.id}`)}>Archive</button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
