import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Ensure fresh data on each request

export default async function ProductsPage() {
  const { data: rawProducts, error } = await supabase
    .from('Products')
    .select('id, name, slug, price, main_image_url, brand:Brands(name), category:Categories(name)')
    .limit(24);

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Data Sanitization: clean and extract only required flat fields for UI rendering
  const products = (rawProducts || []).map((p: any) => {
    const brandObj = Array.isArray(p.brand) ? p.brand[0] : p.brand;
    const categoryObj = Array.isArray(p.category) ? p.category[0] : p.category;

    return {
      id: String(p.id),
      name: String(p.name || 'Unnamed Product'),
      slug: String(p.slug || ''),
      priceFormatted: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : `$${p.price}`,
      brandName: brandObj?.name ? String(brandObj.name) : 'Generic Brand',
      categoryName: categoryObj?.name ? String(categoryObj.name) : 'Electronics',
      imageUrl: p.main_image_url || null,
    };
  });

  return (
    <section>
      <header className="catalog-header">
        <h1 className="catalog-title">Wholesale Product Catalog</h1>
        <p className="catalog-subtitle">CURRYS UK DIRECTIVE // SHOWING MAX 24 ITEMS PER FETCH</p>
      </header>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found in the database catalog.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((prod) => (
            <Link key={prod.id} href={`/product/${prod.slug}`} className="product-card">
              <div>
                <div className="card-image-wrap">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="card-image"
                    />
                  ) : (
                    <div className="card-image-placeholder">No Image</div>
                  )}
                </div>
                <div className="card-header">
                  <span className="category-tag">{prod.categoryName}</span>
                  <span className="brand-name">{prod.brandName}</span>
                </div>
                <h2 className="product-name">{prod.name}</h2>
              </div>
              <div className="card-footer">
                <span className="product-price">{prod.priceFormatted}</span>
                <span className="view-btn">View Specs &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
