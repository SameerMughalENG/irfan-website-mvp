import { supabase } from '@/lib/supabase';
import { LandingClient } from '@/components/LandingClient';

export const revalidate = 0; // Ensure fresh data on each request

export default async function HomePage() {
  // Fetch products to filter student essentials
  const { data: rawProducts, error } = await supabase
    .from('Products')
    .select('id, name, slug, price, main_image_url, brand:Brands(name), category:Categories(name)')
    .order('id', { ascending: true })
    .limit(100);

  if (error) {
    console.error('Error fetching products for landing page:', error);
  }

  // Data Sanitization
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

  // Filter student-friendly categories for "Back to School" specials
  const studentCategories = ['Laptops', 'Tablets', 'Audio', 'Accessories', 'Smartphones'];
  const studentProducts = products
    .filter((p) => studentCategories.includes(p.categoryName))
    .slice(0, 8);

  return <LandingClient studentProducts={studentProducts} />;
}
