import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/ProductDetailClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  const { data: rawProduct, error } = await supabase
    .from('Products')
    .select('id, name, slug, price, stock_quantity, description, main_image_url, brand:Brands(name), category:Categories(name)')
    .eq('slug', slug)
    .single();

  if (error || !rawProduct) {
    console.error('Product fetch error or not found:', error);
    notFound();
  }

  // Data Sanitization
  const brandObj = Array.isArray(rawProduct.brand) ? rawProduct.brand[0] : rawProduct.brand;
  const categoryObj = Array.isArray(rawProduct.category) ? rawProduct.category[0] : rawProduct.category;
  const priceRaw = typeof rawProduct.price === 'number' ? rawProduct.price : parseFloat(String(rawProduct.price || '0'));

  const product = {
    id: String(rawProduct.id),
    name: String(rawProduct.name || 'Unnamed Product'),
    slug: String(rawProduct.slug),
    priceRaw,
    priceFormatted: `£${priceRaw.toFixed(2)}`,
    description: String(rawProduct.description || 'No detailed technical specification available.'),
    brandName: brandObj?.name ? String(brandObj.name) : 'Generic Brand',
    categoryName: categoryObj?.name ? String(categoryObj.name) : 'Electronics',
    stockQty: typeof rawProduct.stock_quantity === 'number' ? rawProduct.stock_quantity : 50,
    imageUrl: rawProduct.main_image_url || null,
  };

  return (
    <article className="detail-container">
      <nav className="breadcrumb-nav">
        <Link href="/products" className="back-link">
          &larr; Back to Wholesale Catalog
        </Link>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-item">{product.categoryName}</span>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <ProductDetailClient 
        id={product.id}
        name={product.name}
        slug={product.slug}
        priceRaw={product.priceRaw}
        priceFormatted={product.priceFormatted}
        description={product.description}
        brandName={product.brandName}
        categoryName={product.categoryName}
        stockQty={product.stockQty}
        imageUrl={product.imageUrl}
      />
    </article>
  );
}
