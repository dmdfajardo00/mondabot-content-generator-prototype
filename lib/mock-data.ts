import { Post } from '@/types/post'

export const mockPosts: Post[] = [
  {
    id: '1',
    date: '2025-09-01',
    title: 'Fajita Fiesta Special',
    text: 'Kick off the month with our sizzling Fajita Fiesta! 🔥 Perfect for sharing with friends and family.',
    description: 'Our signature fajitas made fresh daily with premium ingredients. Served with warm tortillas, guacamole, and all the fixings. Perfect for sharing with friends and family.',
    hashtags: '#FajitaFiesta #MexicanFood #RestaurantLife #FreshIngredients',
    tags: ['fajitas', 'mexican', 'special', 'family-friendly'],
    platforms: ['Facebook', 'Instagram'],
    imageUrl: 'https://images.unsplash.com/photo-1565299715199-866c917206bb?w=600&h=400&fit=crop',
    status: 'Scheduled'
  },
  {
    id: '2',
    date: '2025-09-03',
    title: 'Taco Tuesday Upgrade',
    text: 'Taco Tuesday just got a major upgrade. 🌮 Come try our new Al Pastor tacos!',
    description: 'Our new Al Pastor tacos topped with fresh pineapple, cilantro, and our secret sauce. Made with authentic spices and slow-cooked pork.',
    hashtags: '#TacoTuesday #AlPastor #AuthenticMexican #TacoLovers',
    tags: ['tacos', 'al-pastor', 'tuesday-special', 'authentic'],
    platforms: ['Instagram', 'Facebook'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
    status: 'Scheduled'
  },
  {
    id: '3',
    date: '2025-09-05',
    title: 'Weekend Margarita Special',
    text: 'Weekend vibes start here. Grab a margarita and relax on our patio. 🍹',
    description: 'Join us for weekend happy hour on our beautiful patio. Premium margaritas made with top-shelf tequila and fresh lime juice. Perfect for unwinding after a long week.',
    hashtags: '#WeekendVibes #MargaritaTime #HappyHour #PatioLife',
    tags: ['margaritas', 'happy-hour', 'weekend', 'patio'],
    platforms: ['Instagram', 'Facebook', 'LinkedIn'],
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&h=400&fit=crop',
    status: 'Needs Approval'
  },
  {
    id: '4',
    date: '2025-09-08',
    title: 'Meet Chef Rodriguez',
    text: 'Meet the chef behind the magic! Chef Rodriguez brings 20 years of experience.',
    description: 'Get to know Chef Rodriguez, our talented head chef with 20 years of experience in authentic Mexican cuisine. Learn about his passion for traditional flavors and innovative techniques.',
    hashtags: '#MeetTheChef #BehindTheScenes #ChefLife #RestaurantStory',
    tags: ['chef', 'behind-the-scenes', 'story', 'experience'],
    platforms: ['LinkedIn', 'Facebook'],
    imageUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&h=400&fit=crop',
    status: 'Scheduled'
  },
  {
    id: '5',
    date: '2025-09-10',
    title: 'Fresh Guacamole Daily',
    text: 'Did you know we make our guacamole fresh to order, every single time? 🥑',
    description: 'Our guacamole is made fresh to order with ripe avocados, lime, cilantro, and secret spices. No shortcuts, just pure deliciousness that pairs perfectly with our homemade tortilla chips.',
    hashtags: '#Guacamole #FreshIngredients #MadeToOrder #AvocadoLove',
    tags: ['guacamole', 'fresh', 'avocado', 'made-to-order'],
    platforms: ['Instagram', 'Facebook'],
    imageUrl: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=600&h=400&fit=crop',
    status: 'Published'
  },
  {
    id: '6',
    date: '2025-09-12',
    title: 'Customer Spotlight',
    text: 'Customer spotlight! We love seeing your photos. Thanks for sharing! 📸',
    description: 'We love our amazing customers! Thank you for sharing your dining experiences with us. Your photos and reviews mean the world to our team.',
    hashtags: '#CustomerLove #UGC #ThankYou #CommunityLove',
    tags: ['customer-love', 'ugc', 'community', 'appreciation'],
    platforms: ['Instagram', 'Facebook'],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    status: 'Needs Approval'
  },
  {
    id: '7',
    date: '2025-09-15',
    title: 'Sunday Family Brunch',
    text: 'Sunday Funday Special! Bring the whole family for our all-you-can-eat brunch buffet.',
    description: 'Join us for Sunday family brunch featuring an all-you-can-eat buffet with Mexican breakfast favorites. Kids eat free with adult purchase. Perfect for family gatherings.',
    hashtags: '#SundayBrunch #FamilyTime #KidsEatFree #WeekendSpecial',
    tags: ['brunch', 'family', 'sunday', 'buffet', 'kids-free'],
    platforms: ['Facebook', 'LinkedIn'],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    status: 'Scheduled'
  },
  {
    id: '8',
    date: '2025-09-18',
    title: 'New Vegan Menu Items',
    text: 'New menu alert! 🎉 Introducing our vegan enchiladas with cashew cream sauce.',
    description: 'Exciting news for our plant-based friends! Our new vegan enchiladas feature seasoned vegetables, black beans, and house-made cashew cream sauce. Delicious and completely plant-based.',
    hashtags: '#VeganOptions #NewMenu #PlantBased #HealthyEating',
    tags: ['vegan', 'new-menu', 'plant-based', 'healthy'],
    platforms: ['Instagram', 'LinkedIn'],
    imageUrl: 'https://images.unsplash.com/photo-1564836235910-c3055ca0f912?w=600&h=400&fit=crop',
    status: 'Needs Approval'
  },
  {
    id: '9',
    date: '2025-09-20',
    title: 'Mariachi Friday Nights',
    text: 'Friday night = Mariachi night! Live music starts at 7pm. Reserve your table now!',
    description: 'Experience authentic Mexican culture with live mariachi music every Friday night starting at 7pm. Make your reservations early as tables fill up quickly for this popular weekly event.',
    hashtags: '#LiveMusic #Mariachi #FridayNight #Entertainment',
    tags: ['mariachi', 'live-music', 'friday', 'entertainment', 'reservations'],
    platforms: ['Facebook', 'Instagram', 'LinkedIn'],
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=400&fit=crop',
    status: 'Published'
  },
  {
    id: '10',
    date: '2025-09-25',
    title: 'Team Appreciation',
    text: 'Behind every great meal is a great team. Shoutout to our amazing kitchen staff!',
    description: 'We want to recognize our incredible kitchen team who work tirelessly to bring you delicious meals every day. Their dedication and passion for quality make all the difference.',
    hashtags: '#TeamWork #KitchenCrew #RestaurantTeam #Appreciation',
    tags: ['team', 'appreciation', 'kitchen-staff', 'behind-the-scenes'],
    platforms: ['LinkedIn', 'Facebook'],
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=400&fit=crop',
    status: 'Scheduled'
  }
]