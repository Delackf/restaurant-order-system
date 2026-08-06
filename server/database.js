const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const DATA_DIR = process.env.RENDER ? '/opt/render/project/src/server/data' : path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

let db = null

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function getDefaultDb() {
  return {
    categories: [
      { id: uuidv4(), name: 'Crabs', nameAr: 'كراب', icon: '🦀', sortOrder: 1 },
      { id: uuidv4(), name: 'Desserts', nameAr: 'حلويات', icon: '🍰', sortOrder: 2 },
      { id: uuidv4(), name: 'Ice Cream', nameAr: 'مثلجات', icon: '🍦', sortOrder: 3 },
      { id: uuidv4(), name: 'Drinks', nameAr: 'مشروبات', icon: '🥤', sortOrder: 4 },
    ],
    menuItems: [],
    tables: [],
    orders: [],
    settings: {}
  }
}

function seedMenuItems(db) {
  const crabsCat = db.categories[0].id
  const dessertsCat = db.categories[1].id
  const iceCreamCat = db.categories[2].id
  const drinksCat = db.categories[3].id

  const items = [
    { categoryId: crabsCat, name: 'Grilled Crab', nameAr: 'كراب مشوي', description: 'Fresh crab grilled with special spices', descriptionAr: 'كراب طازج مشوي بتوابل خاصة', price: 45, sortOrder: 1 },
    { categoryId: crabsCat, name: 'Crab Curry', nameAr: 'كاري كراب', description: 'Crab cooked in rich curry sauce', descriptionAr: 'كراب مطبوخ في صلصة كاري غنية', price: 40, sortOrder: 2 },
    { categoryId: crabsCat, name: 'Garlic Butter Crab', nameAr: 'كراب بزبدة الثوم', description: 'Crab sautéed in garlic butter', descriptionAr: 'كراب مقلب بزبدة الثوم', price: 50, sortOrder: 3 },
    { categoryId: crabsCat, name: 'Spicy Crab', nameAr: 'كراب حار', description: 'Crab with spicy chili sauce', descriptionAr: 'كراب بالصلصة الحارة', price: 42, sortOrder: 4 },
    { categoryId: dessertsCat, name: 'Chocolate Cake', nameAr: 'كيك شوكولاتة', description: 'Rich chocolate layer cake', descriptionAr: 'كيك شوكولاتة بطبقات غنية', price: 15, sortOrder: 1 },
    { categoryId: dessertsCat, name: 'Baklava', nameAr: 'بقلاوة', description: 'Traditional sweet pastry', descriptionAr: 'بقلاوة تقليدية بالحلويات', price: 12, sortOrder: 2 },
    { categoryId: dessertsCat, name: 'Cheesecake', nameAr: 'تشيز كيك', description: 'Creamy New York cheesecake', descriptionAr: 'تشيز كيك نيويورك كريمي', price: 18, sortOrder: 3 },
    { categoryId: dessertsCat, name: 'Kunafa', nameAr: 'كنافة', description: 'Traditional Arabic dessert', descriptionAr: 'كنافة تقليدية عربية', price: 14, sortOrder: 4 },
    { categoryId: iceCreamCat, name: 'Vanilla Ice Cream', nameAr: 'آيس كريم فانيليا', description: 'Classic vanilla ice cream', descriptionAr: 'آيس كريم فانيليا كلاسيكي', price: 8, sortOrder: 1 },
    { categoryId: iceCreamCat, name: 'Chocolate Ice Cream', nameAr: 'آيس كريم شوكولاتة', description: 'Rich chocolate ice cream', descriptionAr: 'آيس كريم شوكولاتة غني', price: 8, sortOrder: 2 },
    { categoryId: iceCreamCat, name: 'Strawberry Ice Cream', nameAr: 'آيس كريم فراولة', description: 'Fresh strawberry ice cream', descriptionAr: 'آيس كريم فراولة طازج', price: 8, sortOrder: 3 },
    { categoryId: iceCreamCat, name: 'Mango Sorbet', nameAr: 'سوربيه مانجو', description: 'Refreshing mango sorbet', descriptionAr: 'سوربيه مانجو منعش', price: 10, sortOrder: 4 },
    { categoryId: drinksCat, name: 'Fresh Juice', nameAr: 'عصير طازج', description: 'Fresh seasonal fruit juice', descriptionAr: 'عصير فواكه موسمي طازج', price: 10, sortOrder: 1 },
    { categoryId: drinksCat, name: 'Smoothie', nameAr: 'سموثي', description: 'Fruit smoothie', descriptionAr: 'سموثي فواكه', price: 12, sortOrder: 2 },
    { categoryId: drinksCat, name: 'Coffee', nameAr: 'قهوة', description: 'Arabic coffee', descriptionAr: 'قهوة عربية', price: 6, sortOrder: 3 },
    { categoryId: drinksCat, name: 'Tea', nameAr: 'شاي', description: 'Moroccan tea', descriptionAr: 'شاي مغربي', price: 5, sortOrder: 4 },
    { categoryId: drinksCat, name: 'Soft Drink', nameAr: 'مشروب غازي', description: 'Carbonated soft drink', descriptionAr: 'مشروب غازي', price: 4, sortOrder: 5 },
  ]

  items.forEach(item => {
    db.menuItems.push({
      id: uuidv4(),
      ...item,
      available: 1,
      image: ''
    })
  })
}

function seedTables(db) {
  for (let i = 1; i <= 10; i++) {
    db.tables.push({
      id: uuidv4(),
      number: i,
      name: `Table ${i}`,
      qrCode: `table_${i}`,
      active: 1
    })
  }
}

function initDb() {
  ensureDataDir()

  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
      return
    } catch (e) {
      console.error('Error reading db file, creating new one')
    }
  }

  db = getDefaultDb()
  seedMenuItems(db)
  seedTables(db)
  saveDb()
  console.log('Database initialized with sample data')
}

function saveDb() {
  ensureDataDir()
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8')
}

function getDb() {
  return db
}

module.exports = { initDb, getDb, saveDb }
