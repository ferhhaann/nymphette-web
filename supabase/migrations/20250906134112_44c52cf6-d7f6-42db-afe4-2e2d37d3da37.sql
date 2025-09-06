-- Insert sample blog posts
WITH author_id AS (
  SELECT id FROM authors LIMIT 1
),
category_ids AS (
  SELECT 
    (SELECT id FROM blog_categories WHERE slug = 'travel-tips') as tips_id,
    (SELECT id FROM blog_categories WHERE slug = 'destinations') as dest_id,
    (SELECT id FROM blog_categories WHERE slug = 'culture-history') as culture_id,
    (SELECT id FROM blog_categories WHERE slug = 'adventure') as adventure_id,
    (SELECT id FROM blog_categories WHERE slug = 'food-cuisine') as food_id
)
INSERT INTO blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  featured_image, 
  author_id, 
  category_id, 
  tags, 
  status, 
  featured, 
  meta_title, 
  meta_description,
  reading_time,
  views_count,
  published_at
) VALUES
(
  '10 Essential Travel Tips for First-Time Adventurers',
  '10-essential-travel-tips-first-time-adventurers',
  'Planning your first big adventure? These essential tips will help you travel like a pro and make the most of your journey.',
  'Embarking on your first major travel adventure can be both exhilarating and overwhelming. Whether you''re planning a solo backpacking trip through Southeast Asia or a cultural exploration of Europe, these essential tips will help you navigate the world with confidence.

**1. Research Your Destination Thoroughly**
Understanding local customs, weather patterns, and cultural norms is crucial. Spend time researching not just the tourist attractions, but also local etiquette, tipping practices, and common scams to avoid.

**2. Pack Smart, Not Heavy**
The golden rule of travel: pack half the clothes and twice the money. Choose versatile clothing items that can be mixed and matched, and always pack one complete outfit in your carry-on.

**3. Secure Your Documents**
Make multiple copies of your passport, visa, travel insurance, and important documents. Store them separately and keep digital copies in the cloud.

**4. Budget Wisely**
Research the cost of living in your destination and budget for unexpected expenses. Use apps like Trail Wallet or TravelSpend to track your spending.

**5. Stay Connected but Present**
While it''s important to stay connected for safety, don''t forget to disconnect and immerse yourself in the experience. Consider getting a local SIM card or international plan.

**6. Trust Your Instincts**
If something feels off, trust your gut. Your safety should always be the top priority.

**7. Be Open to Changes**
The best travel experiences often come from unexpected detours and spontaneous decisions. Stay flexible with your itinerary.

**8. Learn Basic Local Phrases**
Even learning "hello," "thank you," and "excuse me" in the local language can make a huge difference in how locals perceive and treat you.

**9. Get Travel Insurance**
Never travel without comprehensive travel insurance. It''s a small price to pay for peace of mind.

**10. Document Your Journey**
Keep a travel journal or blog. You''ll be amazed at how quickly details fade from memory.

Remember, every experienced traveler was once a first-timer. Embrace the learning curve, stay curious, and most importantly, enjoy every moment of your adventure!',
  '/placeholder.svg',
  (SELECT id FROM author_id),
  (SELECT tips_id FROM category_ids),
  ARRAY['travel tips', 'first time travel', 'adventure', 'backpacking'],
  'published',
  true,
  '10 Essential Travel Tips for First-Time Adventurers | Travel Guide',
  'Discover essential travel tips for first-time adventurers. Learn how to pack smart, stay safe, and make the most of your journey with expert advice.',
  8,
  1247,
  NOW() - INTERVAL '2 days'
),
(
  'Hidden Gems of Southeast Asia: Beyond the Tourist Trail',
  'hidden-gems-southeast-asia-beyond-tourist-trail',
  'Discover the unexplored wonders of Southeast Asia with our guide to hidden gems that offer authentic experiences away from the crowds.',
  'Southeast Asia is renowned for its stunning beaches, ancient temples, and vibrant cities. But beyond the well-trodden tourist paths lie hidden gems waiting to be discovered by intrepid travelers seeking authentic experiences.

**Koh Rong Samloem, Cambodia**
While everyone flocks to Thailand''s islands, Cambodia''s Koh Rong Samloem offers pristine beaches without the crowds. Crystal-clear waters, bioluminescent plankton at night, and local fishing villages provide an authentic island experience.

**Pai, Thailand**
Nestled in the mountains of northern Thailand, Pai is a bohemian haven known for its hot springs, waterfalls, and artistic community. The journey there through 762 winding curves is an adventure in itself.

**Flores Island, Indonesia**
Beyond Bali lies Flores, home to the famous Komodo dragons and the stunning Kelimutu volcano with its tri-colored crater lakes. The island offers incredible diving, traditional villages, and dramatic landscapes.

**Hoi An Ancient Town, Vietnam**
While not exactly hidden, Hoi An''s ancient quarter at sunrise, before the tour groups arrive, offers a magical experience. Lantern-lit streets, traditional architecture, and the best street food in Vietnam await early risers.

**Luang Prabang, Laos**
This UNESCO World Heritage city is a perfect blend of traditional Lao and French colonial architecture. Wake early to witness the daily alms giving ceremony and explore the night markets.

**The Mergui Archipelago, Myanmar**
One of the world''s last frontiers, this collection of 800 islands offers untouched coral reefs, pristine beaches, and encounters with the nomadic Moken sea people.

**Raja Ampat, Indonesia**
Known as the "Four Kings," this remote archipelago boasts the richest marine biodiversity on Earth. It''s a diver''s paradise with 75% of all known coral species.

**Planning Your Hidden Gem Adventure**
- Travel during shoulder seasons for fewer crowds
- Hire local guides to discover secret spots
- Stay in locally-owned accommodations
- Be respectful of local customs and environments
- Pack light and be prepared for basic amenities

These hidden gems offer the chance to experience Southeast Asia as it was meant to be: authentic, unspoiled, and magical. The journey to these remote places requires more planning and flexibility, but the rewards are immeasurable.',
  '/placeholder.svg',
  (SELECT id FROM author_id),
  (SELECT dest_id FROM category_ids),
  ARRAY['southeast asia', 'hidden gems', 'off the beaten path', 'authentic travel'],
  'published',
  false,
  'Hidden Gems of Southeast Asia: Authentic Travel Beyond Tourist Trails',
  'Explore hidden gems in Southeast Asia beyond crowded tourist destinations. Discover authentic experiences in Cambodia, Thailand, Indonesia, and more.',
  12,
  892,
  NOW() - INTERVAL '5 days'
),
(
  'The Art of Slow Travel: Why Less is More',
  'art-of-slow-travel-why-less-is-more',
  'Embrace the philosophy of slow travel and discover how taking your time can lead to more meaningful and enriching travel experiences.',
  'In our fast-paced world, the concept of slow travel is gaining momentum among thoughtful travelers who prioritize depth over breadth, quality over quantity.

**What is Slow Travel?**
Slow travel is a philosophy that emphasizes connection with local people, cultures, and places. Instead of rushing through a checklist of tourist attractions, slow travelers spend more time in fewer places, allowing for deeper immersion and understanding.

**The Benefits of Slowing Down**

**Cultural Immersion**
When you spend weeks or months in a destination, you move beyond surface-level tourist experiences. You start to understand local rhythms, make genuine connections, and see places through the eyes of residents rather than visitors.

**Environmental Impact**
Slow travel significantly reduces your carbon footprint. By staying longer in each destination and using local transportation, you minimize the environmental impact of frequent flights and transfers.

**Economic Benefits**
Longer stays often mean better rates on accommodations and the opportunity to find local deals. You''ll also naturally spend money at local businesses rather than tourist-oriented establishments.

**Mental Health**
Without the pressure to see everything, slow travel reduces stress and travel fatigue. You can wake up without an agenda, discover spontaneous opportunities, and truly relax.

**How to Practice Slow Travel**

**Choose Your Base Wisely**
Select a location that offers diverse experiences within a reasonable radius. Cities with good public transportation or regions with walkable towns work well.

**Rent Apartments or Houses**
Staying in accommodations with kitchens allows you to shop at local markets, cook regional dishes, and live more like a local.

**Learn the Language**
Even basic language skills open doors to deeper cultural exchanges and friendships.

**Use Local Transportation**
Buses, trains, and bicycles not only reduce costs but also provide opportunities to interact with locals and see the landscape at a human pace.

**Embrace Routine**
Develop daily habits like visiting the same café, shopping at the local market, or taking evening walks. These routines help you feel at home and build relationships.

**Popular Slow Travel Destinations**
- Portugal: Affordable, safe, with excellent train connections
- Mexico: Rich culture, diverse landscapes, and welcoming communities
- Vietnam: Incredible food scene and efficient bus networks
- Greece: Island-hopping at a leisurely pace
- Colombia: Emerging destination with incredible diversity

**Making the Transition**
Start small. Instead of visiting five countries in two weeks, choose one region and explore it thoroughly. You''ll likely find that the memories from slow travel are richer and more lasting.

Slow travel isn''t just about moving slowly; it''s about traveling mindfully. It''s about quality conversations, unexpected discoveries, and the luxury of time – perhaps the most precious travel commodity of all.',
  '/placeholder.svg',
  (SELECT id FROM author_id),
  (SELECT tips_id FROM category_ids),
  ARRAY['slow travel', 'mindful travel', 'sustainable tourism', 'cultural immersion'],
  'published',
  false,
  'The Art of Slow Travel: Meaningful Journeys Over Quick Trips',
  'Discover the benefits of slow travel. Learn how taking your time leads to deeper cultural connections, reduced environmental impact, and more meaningful experiences.',
  10,
  654,
  NOW() - INTERVAL '1 week'
),
(
  'Culinary Adventures: A Food Lover''s Guide to Japan',
  'culinary-adventures-food-lovers-guide-japan',
  'Embark on a gastronomic journey through Japan, from street food stalls to Michelin-starred restaurants, and discover the art of Japanese cuisine.',
  'Japan offers one of the world''s most sophisticated culinary landscapes, where centuries-old traditions meet innovative techniques to create unforgettable dining experiences.

**Understanding Japanese Food Culture**

Japanese cuisine, or "washoku," is recognized by UNESCO as an Intangible Cultural Heritage. It emphasizes seasonal ingredients, natural flavors, and beautiful presentation. The concept of "ichigo ichie" (one time, one meeting) applies to meals as well – each dining experience is unique and should be treasured.

**Regional Specialties to Discover**

**Tokyo: The Culinary Capital**
Tokyo boasts more Michelin stars than any other city. Beyond high-end dining, explore:
- **Tsukiji Outer Market**: Fresh sushi and street food
- **Ramen Districts**: Each neighborhood has its signature style
- **Izakayas**: Traditional pub-style restaurants
- **Department Store Basement Food Courts**: Gourmet ingredients and prepared foods

**Osaka: The Kitchen of Japan**
Known for hearty comfort food:
- **Takoyaki**: Octopus balls from street vendors
- **Okonomiyaki**: Savory pancakes customized to your liking
- **Kushikatsu**: Fried skewers with strict dipping rules
- **Dotonbori District**: Neon-lit food paradise

**Kyoto: Traditional Kaiseki**
Experience refined multi-course dining:
- **Kaiseki**: Elaborate seasonal menus showcasing technique and presentation
- **Tofu Cuisine**: Buddhist-inspired vegetarian dishes
- **Matcha Culture**: Traditional tea ceremony and sweets
- **Arashiyama**: Bamboo groves and traditional restaurants

**Essential Japanese Dining Etiquette**

**Chopstick Rules**
- Never stick chopsticks upright in rice (resembles funeral rites)
- Don''t pass food directly from chopsticks to chopsticks
- Use the opposite end to take food from shared dishes

**Slurping is Encouraged**
When eating noodles, slurping is not only acceptable but shows appreciation for the dish and helps cool the noodles.

**No Tipping**
Exceptional service is expected, not rewarded with tips. Attempting to tip can actually be offensive.

**Must-Try Experiences**

**Sushi Counter Experience**
Sit at the counter (sushi-ya) and let the chef guide your experience. Fresh wasabi, perfectly seasoned rice, and the chef''s recommendation create an unforgettable meal.

**Ramen Exploration**
From rich tonkotsu in Fukuoka to light shoyu in Tokyo, each region has distinct ramen styles. Use vending machines to order, and don''t feel pressured to finish the broth.

**Kaiseki Dinner**
Book a traditional kaiseki experience to understand the artistry of Japanese cuisine. Each course represents a season and tells a story through flavors and presentation.

**Street Food Adventures**
- **Yakitori**: Grilled chicken skewers with varying cuts
- **Taiyaki**: Fish-shaped pastries filled with sweet red bean paste
- **Imagawayaki**: Round cakes with various fillings
- **Kakigori**: Shaved ice with flavored syrups

**Seasonal Eating**

Spring brings sakura-flavored everything, summer offers cool soba noodles, autumn celebrates mushrooms and persimmons, while winter warms with hot pot dishes.

**Food Markets and Cooking Classes**
- Visit local markets early morning for the freshest ingredients
- Take cooking classes to learn knife skills and basic techniques
- Join food tours led by locals for insider knowledge

**Dietary Considerations**
Japan is becoming more accommodating to dietary restrictions, but communication is key. Learn key phrases for allergies or preferences, and research restaurants in advance.

The Japanese approach to food – respecting ingredients, honoring traditions, and pursuing perfection – offers lessons that extend far beyond the kitchen. Every meal in Japan is an opportunity to participate in a culture that has elevated eating to an art form.',
  '/placeholder.svg',
  (SELECT id FROM author_id),
  (SELECT food_id FROM category_ids),
  ARRAY['japanese cuisine', 'food travel', 'culinary adventure', 'sushi', 'ramen'],
  'published',
  false,
  'Culinary Adventures in Japan: Ultimate Food Lover''s Travel Guide',
  'Explore Japan''s incredible food culture from Tokyo''s Michelin stars to Osaka''s street food. Discover ramen, sushi, kaiseki, and local dining etiquette.',
  15,
  1103,
  NOW() - INTERVAL '10 days'
),
(
  'Digital Nomad''s Paradise: Working Remotely from Bali',
  'digital-nomad-paradise-working-remotely-bali',
  'Discover why Bali has become the ultimate destination for digital nomads, with insights on best areas to stay, co-working spaces, and living costs.',
  'Bali has emerged as the crown jewel of digital nomad destinations, offering the perfect blend of tropical paradise, modern amenities, and an established remote work community.

**Why Bali Works for Digital Nomads**

**Reliable Internet Infrastructure**
Most areas popular with nomads offer high-speed internet (20-50 Mbps), with fiber optic connections available in major hubs. Many cafés and co-working spaces provide backup connections.

**Affordable Cost of Living**
Your money stretches further in Bali:
- **Accommodation**: $300-800/month for modern apartments
- **Food**: $2-10 per meal depending on local vs. western cuisine
- **Transportation**: Scooter rental $50/month, ride-sharing available
- **Co-working**: $50-150/month for premium spaces

**Thriving Nomad Community**
Bali hosts thousands of digital nomads year-round, creating networking opportunities, collaboration potential, and built-in social circles.

**Best Areas for Digital Nomads**

**Canggu: The Nomad Capital**
The epicenter of Bali''s digital nomad scene:
- **Pros**: Excellent co-working spaces, vibrant nightlife, great surf
- **Cons**: Can be crowded, traffic congestion
- **Best for**: Entrepreneurs, content creators, those seeking active social scene

**Ubud: Cultural Immersion**
Traditional Balinese culture meets modern amenities:
- **Pros**: Peaceful environment, cultural activities, healthy food scene
- **Cons**: Limited nightlife, can feel touristy
- **Best for**: Writers, designers, those seeking inspiration and tranquility

**Sanur: Quiet Productivity**
Family-friendly area with fewer nomads:
- **Pros**: Quieter, better infrastructure, easy airport access
- **Cons**: Less nomad community, limited co-working options
- **Best for**: Long-term stays, those needing fewer distractions

**Seminyak: Upscale Base**
More expensive but sophisticated:
- **Pros**: Upscale dining, luxury accommodations, beach clubs
- **Cons**: Higher costs, traffic congestion
- **Best for**: Established nomads with higher budgets

**Top Co-working Spaces**

**Dojo Bali (Canggu)**
The original nomad co-working space with multiple locations, offering day passes, monthly memberships, and community events.

**Hubud (Ubud)**
Pioneer in the Ubud scene, known for its community focus and collaborative atmosphere.

**Outpost (Canggu)**
Modern space with excellent facilities, regular events, and a strong community vibe.

**Practical Considerations**

**Visa Options**
- **Visa on Arrival**: 30 days, extendable once
- **B213 Visit Visa**: 60 days, single entry
- **B211 Visit Visa**: 60 days, can be extended to 180 days total

**Health and Safety**
- Comprehensive travel insurance is essential
- Be cautious with water quality
- Scooter safety is crucial – always wear a helmet
- Register with local police if staying long-term

**Cultural Sensitivity**
- Respect local customs and dress codes
- Learn basic Bahasa Indonesia phrases
- Participate in local ceremonies when invited
- Support local businesses alongside nomad-focused ones

**Productivity Tips**

**Manage the Paradise Paradox**
It''s easy to get distracted by beach days and temple visits. Set clear work schedules and stick to them.

**Handle Time Zone Challenges**
Bali is GMT+8, which can be challenging for working with US or European clients. Plan your schedule accordingly.

**Build Routine**
Establish daily routines including workspace, meal times, and exercise to maintain productivity.

**Networking Opportunities**
- Attend co-working events and workshops
- Join Facebook groups like "Digital Nomads Bali"
- Participate in skill-sharing sessions
- Attend nomad meetups and social events

**Common Challenges and Solutions**

**Scooter Culture**
Traffic can be chaotic. Consider staying close to your workspace or using ride-sharing apps during peak hours.

**Monsoon Season**
Plan for the rainy season (October-March) with indoor workspace options and appropriate accommodation.

**Visa Runs**
Build visa extensions and border runs into your travel plans. Popular destinations include Singapore, Kuala Lumpur, or other Indonesian islands.

Bali offers an unparalleled opportunity to combine productive remote work with an incredible lifestyle. The key is finding the right balance between work, adventure, and cultural immersion while being respectful of the local community that makes it all possible.',
  '/placeholder.svg',
  (SELECT id FROM author_id),
  (SELECT adventure_id FROM category_ids),
  ARRAY['digital nomad', 'remote work', 'bali', 'coworking', 'lifestyle'],
  'published',
  false,
  'Digital Nomad Guide to Bali: Remote Work in Paradise',
  'Complete guide to working remotely from Bali. Discover the best areas, co-working spaces, visa options, and cost of living for digital nomads.',
  14,
  967,
  NOW() - INTERVAL '2 weeks'
);