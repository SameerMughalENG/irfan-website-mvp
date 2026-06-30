import { supabase } from '@/lib/supabase';
import { CatalogClient } from '@/components/CatalogClient';

export const revalidate = 0; // Ensure fresh data on each request

export default async function ProductsPage() {
  const { data: rawProducts, error } = await supabase
    .from('Products')
    .select('id, name, slug, price, main_image_url, brand:Brands(name), category:Categories(name)')
    .order('id', { ascending: true })
    .limit(100);

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Data Sanitization: clean and extract only required flat fields for UI rendering
  const products = (rawProducts || []).map((p: any) => {
    const brandObj = Array.isArray(p.brand) ? p.brand[0] : p.brand;
    const categoryObj = Array.isArray(p.category) ? p.category[0] : p.category;
    const priceRaw = typeof p.price === 'number' ? p.price : parseFloat(String(p.price || '0'));

    return {
      id: String(p.id),
      name: String(p.name || 'Unnamed Product'),
      slug: String(p.slug || ''),
      priceRaw,
      priceFormatted: `£${priceRaw.toFixed(2)}`,
      brandName: brandObj?.name ? String(brandObj.name) : 'Generic Brand',
      categoryName: categoryObj?.name ? String(categoryObj.name) : 'Electronics',
      imageUrl: p.main_image_url || null,
    };
  });

  const categories = Array.from(new Set(products.map((p) => p.categoryName))).filter(Boolean).sort();
  const brands = Array.from(new Set(products.map((p) => p.brandName))).filter(Boolean).sort();

  return (
    <section>
      <header className="catalog-header">
        <div className="catalog-header-text">
          <span className="badge-pill">B2B WHOLESALE DIRECTORY</span>
          <h1 className="catalog-title">Enterprise Electronics Catalog</h1>
          <p className="catalog-subtitle">Instant volume quotes, real-time inventory verification, and Sameer's Direct dispatch.</p>
        </div>
      </header>

      <CatalogClient 
        initialProducts={products} 
        categories={categories} 
        brands={brands} 
      />
    </section>
  );
}
