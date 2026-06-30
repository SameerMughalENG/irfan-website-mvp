import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  const { data: rawProduct, error } = await supabase
    .from('products')
    .select('id, name, slug, price, description, brand:brands(name), category:categories(name)')
    .eq('slug', slug)
    .single();

  if (error || !rawProduct) {
    console.error('Product fetch error or not found:', error);
    notFound();
  }

  // Data Sanitization
  const brandObj = Array.isArray(rawProduct.brand) ? rawProduct.brand[0] : rawProduct.brand;
  const categoryObj = Array.isArray(rawProduct.category) ? rawProduct.category[0] : rawProduct.category;

  const product = {
    name: String(rawProduct.name || 'Unnamed Product'),
    priceFormatted: typeof rawProduct.price === 'number' ? `$${rawProduct.price.toFixed(2)}` : `$${rawProduct.price}`,
    description: String(rawProduct.description || 'No detailed technical specification available.'),
    brandName: brandObj?.name ? String(brandObj.name) : 'Generic Brand',
    categoryName: categoryObj?.name ? String(categoryObj.name) : 'Electronics',
  };

  return (
    <article className="detail-container">
      <Link href="/products" className="back-link">
        &larr; Back to Catalog
      </Link>

      <div className="detail-card">
        <div className="detail-meta">
          <span className="category-tag">{product.categoryName}</span>
          <span className="brand-badge" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
            BRAND: {product.brandName}
          </span>
        </div>

        <h1 className="detail-title">{product.name}</h1>

        <div className="detail-price-bar">
          <span className="price-label">Wholesale Unit Price</span>
          <span className="detail-price">{product.priceFormatted}</span>
        </div>

        <section className="specs-section">
          <h2 className="specs-title">Technical Specification &amp; Description</h2>
          <div className="detail-description">{product.description}</div>
        </section>
      </div>
    </article>
  );
}
