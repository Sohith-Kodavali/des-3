// ============================================
// ABC Kitchen — Site data (single source)
// Swap fields, images, menu items here per client
// ============================================
window.SITE = {
  brand: {
    name: 'ABC Kitchen',
    tagline: 'Farm-picked, kitchen-crafted.',
    since: 'Since 2025'
  },
  contact: {
    phone: '+91 00000 00000',
    phoneRaw: '910000000000',
    whatsapp: '910000000000',
    address: '123 Placeholder Street, Your City, State 000000',
    hours: '11:00 AM – 11:00 PM',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15542.898!2d78.4867!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!5e0!3m2!1sen!2sin!4v1700000000000'
  },
  hero: {
    kicker: 'Farm to table · seasonal menu',
    line1: 'Real food,',
    accent: 'grown honest,',
    line2: 'cooked with intention.',
    lead: 'A short seasonal menu, sourced from farmers we know by name. Nothing frozen, nothing rushed — just food that tastes the way it should.',
    image: 'img/2.jpeg',
    imageAlt: 'A seasonal plate at ABC Kitchen'
  },
  serviceHours: { open: '11:00', close: '23:00' },
  stats: [
    { value: '12', suffix: '', label: 'Local farms' },
    { value: '4.9', suffix: '★', label: 'Guest rating' },
    { value: '0', suffix: '', label: 'Preservatives' }
  ],
  values: [
    { title: 'Sourced weekly', desc: 'Vegetables and dairy delivered by local farms every Monday and Thursday.' },
    { title: 'Zero waste kitchen', desc: 'Peels become stock, leaves become chutney, offcuts feed the compost pile out back.' },
    { title: 'Seasonal by design', desc: 'The menu rewrites itself four times a year — because the harvest does too.' },
    { title: 'Honest pricing', desc: 'What you see is what you pay. No service fees, no packaging surprises.' }
  ],
  ingredients: [
    { emoji: 'leaf', label: 'Fresh greens', from: 'Rao Farms · 12 km away' },
    { emoji: 'grain', label: 'Whole grains', from: 'Verma Mill · 24 km away' },
    { emoji: 'milk', label: 'Farm dairy', from: 'Green Meadow · 8 km away' },
    { emoji: 'herbs', label: 'Fresh herbs', from: 'Our rooftop garden' }
  ],
  gallery: [
    { image: 'img/10.jpeg', caption: 'Morning harvest' },
    { image: 'img/11.jpeg', caption: 'The kitchen line' },
    { image: 'img/12.jpeg', caption: 'Seasonal plate' },
    { image: 'img/13.jpeg', caption: 'Family style' },
    { image: 'img/14.jpeg', caption: 'From the wood oven' },
    { image: 'img/15.jpeg', caption: 'Table for eight' }
  ],
  testimonials: [
    { name: 'Meera R.', stars: 5, text: 'Everything tastes just-picked. The paneer tikka is the best I have had in years.' },
    { name: 'Aditya P.', stars: 5, text: 'They actually change the menu with the season. That is rare, and it shows.' },
    { name: 'Sneha V.', stars: 4, text: 'Warm, unpretentious place. Portions are honest. The lassi is unreal.' }
  ],
  categories: [
    { key: 'starters', label: 'Starters' },
    { key: 'main-course', label: 'Mains' },
    { key: 'biryani', label: 'Rice bowls' },
    { key: 'breads', label: 'Breads' },
    { key: 'noodles', label: 'Noodles' },
    { key: 'beverages', label: 'Drinks' },
    { key: 'desserts', label: 'Sweets' }
  ],
  menu: [
    { name: 'Paneer Tikka', category: 'starters', diet: 'veg', desc: 'Char-grilled cottage cheese, lemon, mint chutney', price: 220, image: 'img/3.jpeg', tag: 'Signature', featured: true },
    { name: 'Veg Manchurian', category: 'starters', diet: 'veg', desc: 'Crispy veg dumplings, tangy soy glaze', price: 180, image: 'img/4.jpeg' },
    { name: 'Crispy Corn', category: 'starters', diet: 'veg', desc: 'Golden fried sweet corn, pepper, curry leaf', price: 160, image: 'img/5.jpeg' },
    { name: 'Chef Platter', category: 'starters', diet: 'veg', desc: 'A tasting of our four favourite starters', price: 380, image: 'img/10.jpeg', tag: 'Sharing' },

    { name: 'Paneer Butter Masala', category: 'main-course', diet: 'veg', desc: 'Slow-simmered tomato, cashew, fresh cream', price: 240, image: 'img/11.jpeg', tag: 'Bestseller', featured: true },
    { name: 'Dal Makhani', category: 'main-course', diet: 'veg', desc: '24 hour slow cooked black lentils, butter finish', price: 200, image: 'img/12.jpeg' },
    { name: 'Palak Paneer', category: 'main-course', diet: 'veg', desc: 'Spinach, cottage cheese, gentle spice', price: 220, image: 'img/13.jpeg' },
    { name: 'Kadai Vegetables', category: 'main-course', diet: 'veg', desc: 'Mixed vegetables, roasted kadai masala', price: 190, image: 'img/14.jpeg' },
    { name: 'Mushroom Masala', category: 'main-course', diet: 'veg', desc: 'Button mushrooms, onion tomato masala', price: 210, image: 'img/15.jpeg' },

    { name: 'Veg Biryani', category: 'biryani', diet: 'veg', desc: 'Aged basmati, seasonal veg, saffron', price: 220, image: 'img/16.jpeg', tag: 'Popular' },
    { name: 'Paneer Biryani', category: 'biryani', diet: 'veg', desc: 'Basmati, char-cooked paneer, fried onion', price: 260, image: 'img/17.jpeg' },
    { name: 'Jeera Rice', category: 'biryani', diet: 'veg', desc: 'Aromatic basmati tempered with cumin', price: 150, image: 'img/18.jpeg' },
    { name: 'Veg Fried Rice', category: 'biryani', diet: 'veg', desc: 'Wok-tossed rice, garden veg, soy', price: 170, image: 'img/19.jpeg' },

    { name: 'Butter Naan', category: 'breads', diet: 'veg', desc: 'Soft, buttery, tandoor baked', price: 50, image: 'img/6.jpeg' },
    { name: 'Garlic Naan', category: 'breads', diet: 'veg', desc: 'Naan finished with roasted garlic, herbs', price: 60, image: 'img/6.jpeg' },
    { name: 'Butter Roti', category: 'breads', diet: 'veg', desc: 'Whole wheat, brushed with white butter', price: 40, image: 'img/6.jpeg' },
    { name: 'Lachha Paratha', category: 'breads', diet: 'veg', desc: 'Layered, flaky, hand rolled', price: 55, image: 'img/6.jpeg' },

    { name: 'Hakka Noodles', category: 'noodles', diet: 'veg', desc: 'Wok tossed noodles, vegetables, soy', price: 170, image: 'img/20.jpeg' },
    { name: 'Schezwan Noodles', category: 'noodles', diet: 'veg', desc: 'Spicy chilli-garlic Indo-Chinese noodles', price: 190, image: 'img/21.jpeg' },

    { name: 'Fresh Lime Soda', category: 'beverages', diet: 'veg', desc: 'Sweet, salted, or mixed', price: 80, image: 'img/22.jpeg' },
    { name: 'Mango Lassi', category: 'beverages', diet: 'veg', desc: 'Chilled yoghurt whipped with Alphonso pulp', price: 120, image: 'img/23.jpeg', featured: true },
    { name: 'Masala Chai', category: 'beverages', diet: 'veg', desc: 'Spiced Indian tea, brewed to order', price: 40, image: 'img/22.jpeg' },

    { name: 'Gulab Jamun', category: 'desserts', diet: 'veg', desc: 'Warm milk dumplings in cardamom syrup (2 pcs)', price: 80, image: 'img/23.jpeg' },
    { name: 'Vanilla Bean Ice Cream', category: 'desserts', diet: 'veg', desc: 'Single-origin vanilla, generous scoop', price: 70, image: 'img/23.jpeg' }
  ]
};
