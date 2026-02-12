const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rahma_organics',
  password: '3455',
  port: 5432,
});

async function setupSettings() {
  try {
    console.log("🔧 Setting up site settings...");

    // Create settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Settings table created");

    // Create pages table for static content
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Pages table created");

    // Insert default settings
    const defaultSettings = [
      { key: 'site_name', value: 'Rahma Organics' },
      { key: 'site_tagline', value: 'Pure Organic Care for Hair, Skin & Body' },
      { key: 'contact_email', value: 'info@rahmaorganics.com' },
      { key: 'contact_phone', value: '+254 700 000 000' },
      { key: 'contact_address', value: 'Nairobi, Kenya' },
      { key: 'facebook_url', value: 'https://facebook.com/rahmaorganics' },
      { key: 'instagram_url', value: 'https://instagram.com/rahmaorganics' },
      { key: 'twitter_url', value: 'https://twitter.com/rahmaorganics' },
      { key: 'whatsapp_number', value: '+254700000000' },
      { key: 'business_hours', value: 'Mon - Fri: 9AM - 6PM, Sat: 10AM - 4PM' },
    ];

    for (const setting of defaultSettings) {
      await pool.query(
        `INSERT INTO site_settings (key, value) 
         VALUES ($1, $2) 
         ON CONFLICT (key) DO NOTHING`,
        [setting.key, setting.value]
      );
    }
    console.log("✅ Default settings added");

    // Insert default pages
    const defaultPages = [
      {
        slug: 'faq',
        title: 'Frequently Asked Questions',
        content: `# Frequently Asked Questions

## Ordering
**Q: How do I place an order?**
A: Browse our products, add items to cart, and proceed to checkout.

**Q: What payment methods do you accept?**
A: We accept M-Pesa payments.

## Shipping
**Q: How long does delivery take?**
A: Delivery takes 2-5 business days within Kenya.

**Q: Do you ship internationally?**
A: Currently, we only ship within Kenya.

## Products
**Q: Are your products 100% organic?**
A: Yes, all our products are made with certified organic ingredients.

**Q: Can I return a product?**
A: Yes, we accept returns within 14 days of purchase.`
      },
      {
        slug: 'shipping',
        title: 'Shipping Information',
        content: `# Shipping Information

## Delivery Areas
We deliver to all major cities and towns in Kenya.

## Delivery Times
- Nairobi: 1-2 business days
- Other cities: 3-5 business days

## Shipping Costs
- Orders over KSh 2,000: FREE shipping
- Orders under KSh 2,000: KSh 200

## Tracking
You'll receive a tracking number once your order ships.`
      },
      {
        slug: 'returns',
        title: 'Returns & Refunds',
        content: `# Returns & Refunds

## Return Policy
We accept returns within 14 days of purchase.

## Conditions
- Product must be unused
- Original packaging required
- Receipt or proof of purchase needed

## Refund Process
1. Contact us to initiate return
2. Ship product back to us
3. Refund processed within 7 days

## Contact
Email: info@rahmaorganics.com
Phone: +254 700 000 000`
      },
      {
        slug: 'privacy',
        title: 'Privacy Policy',
        content: `# Privacy Policy

## Information We Collect
- Name and contact information
- Order history
- Payment information (securely processed)

## How We Use Your Information
- Process orders
- Send order updates
- Improve our services

## Data Security
We use industry-standard security measures to protect your data.

## Your Rights
You can request to view, update, or delete your personal information.

Last updated: February 2026`
      },
      {
        slug: 'terms',
        title: 'Terms & Conditions',
        content: `# Terms & Conditions

## Use of Website
By using this website, you agree to these terms.

## Products
All products are subject to availability.

## Pricing
Prices are in Kenyan Shillings and may change without notice.

## Orders
We reserve the right to refuse or cancel any order.

## Liability
We are not liable for any indirect or consequential damages.

Last updated: February 2026`
      }
    ];

    for (const page of defaultPages) {
      await pool.query(
        `INSERT INTO pages (slug, title, content) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (slug) DO NOTHING`,
        [page.slug, page.title, page.content]
      );
    }
    console.log("✅ Default pages added");

    console.log("\n🎉 Site settings setup complete!");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await pool.end();
    process.exit(1);
  }
}

setupSettings();
