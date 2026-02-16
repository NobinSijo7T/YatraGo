const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI_OLD || 'mongodb://localhost:27017/travel';

const destinations = [
    // EUROPE
    {
        name: "London, UK",
        details: "A historical powerhouse with a modern soul. From the Tower of London to the Shard, it's a city of contrasts.",
        whatToDo: ["Visit the British Museum", "See a show at West End", "Walk across Tower Bridge", "Explore Camden Market", "Ride the London Eye"],
        packingList: ["Umbrella", "Oyster card (app)", "Comfortable walking shoes", "Raincoat", "Adapter Type G"],
        images: [
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
            "https://images.unsplash.com/photo-1529655683826-aba9b3e77383",
            "https://images.unsplash.com/photo-1486299267070-83823f5448dd"
        ],
        category: "Things to Do",
        continent: "Europe",
        expense: "Luxury",
        tags: ["History", "Shopping", "Culture"]
    },
    {
        name: "Rome, Italy",
        details: "The Eternal City, where every corner reveals thousands of years of history and world-class pasta.",
        whatToDo: ["Visit the Colosseum", "Throw a coin in Trevi Fountain", "Explore the Vatican Museums", "Walk through the Roman Forum", "Eat Gelato in Trastevere"],
        packingList: ["Scarf for churches", "Reusable bottle", "Sunscreen", "Italian phrasebook", "Power bank"],
        images: [
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
            "https://images.unsplash.com/photo-1529260830199-42c24126f198",
            "https://images.unsplash.com/photo-1515542641795-85ed3b821397"
        ],
        category: "Things to Do",
        continent: "Europe",
        expense: "Mid-range",
        tags: ["History", "Food", "Art"]
    },
    {
        name: "Barcelona, Spain",
        details: "Gaudi's masterpiece of a city, blending stunning architecture with beautiful beaches and endless tapas.",
        whatToDo: ["Marvel at Sagrada Família", "Walk through Park Güell", "Stroll down La Rambla", "Sunbathe at Barceloneta Beach", "Eat at La Boqueria"],
        packingList: ["Sunglasses", "Swimwear", "Light linen clothes", "Cross-body bag", "Comfortable sandals"],
        images: [
            "https://images.unsplash.com/photo-1583422409516-2895a77efded",
            "https://images.unsplash.com/photo-1539186607619-df476afe3ff1",
            "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4"
        ],
        category: "Things to Do",
        continent: "Europe",
        expense: "Mid-range",
        tags: ["Beach", "Architecture", "Nightlife"]
    },
    {
        name: "Amsterdam, Netherlands",
        details: "A city of canals, bicycles, and world-renowned museums, with a unique and liberal atmosphere.",
        whatToDo: ["Visit Anne Frank House", "Cycle through the Jordaan", "Take a canal cruise", "See the Van Gogh Museum", "Explore the Vondelpark"],
        packingList: ["Waterproof jacket", "Bicycle lock", "Multi-layered clothing", "Camera", "Smartphone with map"],
        images: [
            "https://images.unsplash.com/photo-1512470876302-972fad2aa9dd",
            "https://images.unsplash.com/photo-1534351590666-13e3e96b5017",
            "https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3"
        ],
        category: "Things to Do",
        continent: "Europe",
        expense: "Mid-range",
        tags: ["Culture", "Biking", "Nature"]
    },
    {
        name: "Prague, Czech Republic",
        details: "The City of a Hundred Spires, known for its Old Town Square, baroque buildings, and Gothic churches.",
        whatToDo: ["Walk across Charles Bridge", "Explore Prague Castle", "See the Astronomical Clock", "Wander through the Jewish Quarter", "Drink local Czech beer"],
        packingList: ["Warm coat (winter)", "Walking shoes", "Offline map", "Cash in Czech Koruna", "Scarf"],
        images: [
            "https://images.unsplash.com/photo-1519677100203-ad01df321c2e",
            "https://images.unsplash.com/photo-1527004013197-26613951dbfd",
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
        ],
        category: "Things to Do",
        continent: "Europe",
        expense: "Budget",
        tags: ["History", "Architecture", "Nightlife"]
    },
    // ASIA
    {
        name: "Seoul, South Korea",
        details: "A high-tech city that respects its traditions, famous for K-Pop, skincare, and incredible street food.",
        whatToDo: ["Visit Gyeongbokgung Palace", "Shop in Myeongdong", "Hike Namsan Mountain", "Eat at Gwangjang Market", "Explore Bukchon Hanok Village"],
        packingList: ["T-money card", "Sheet masks", "Walking shoes", "Korean phrasebook", "Portable WiFi"],
        images: [
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
            "https://images.unsplash.com/photo-1535139262974-676fe41fd5e6",
            "https://images.unsplash.com/photo-1571330735066-03add43200af"
        ],
        category: "Things to Do",
        continent: "Asia",
        expense: "Mid-range",
        tags: ["Tech", "Food", "Fashion"]
    },
    {
        name: "Bangkok, Thailand",
        details: "A vibrant, chaotic metropolis with ornate shrines and a lively street life.",
        whatToDo: ["Visit the Grand Palace", "Explore Wat Arun", "Shop at Chatuchak Market", "Eat Pad Thai on Khao San Road", "Take a ferry on Chao Phraya River"],
        packingList: ["Loose cotton clothes", "Modest attire for temples", "Bug spray", "Sunscreen", "Cooling towels"],
        images: [
            "https://images.unsplash.com/photo-1508009603885-50cf7c57936a",
            "https://images.unsplash.com/photo-1563492065599-3520f775eeed",
            "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4"
        ],
        category: "Things to Do",
        continent: "Asia",
        expense: "Budget",
        tags: ["Temple", "Food", "Street Market"]
    },
    {
        name: "Singapore",
        details: "A futuristic garden city known for its cleanliness, diverse culture, and melting pot of cuisines.",
        whatToDo: ["Visit Gardens by the Bay", "Explore Jewel Changi Airport", "Eat at a Hawker Centre", "See the Merlion Park", "Shop on Orchard Road"],
        packingList: ["Reusable water bottle", "Lightweight jacket (for AC)", "Sunscreen", "Comfortable walking shoes", "EZ-Link card"],
        images: [
            "https://images.unsplash.com/photo-1525625239911-988181674205",
            "https://images.unsplash.com/photo-1557002665-c552e1832483",
            "https://images.unsplash.com/photo-1559592413-7cea83781cbd"
        ],
        category: "Things to Do",
        continent: "Asia",
        expense: "Luxury",
        tags: ["Modern", "Food", "Garden"]
    },
    {
        name: "Kyoto, Japan",
        details: "The heart of traditional Japan, filled with thousands of classical Buddhist temples and Shinto shrines.",
        whatToDo: ["Visit Fushimi Inari-taisha", "Walk through Kinkaku-ji (Golden Pavilion)", "Explore Arashiyama Bamboo Grove", "See a Geisha in Gion", "Visit Kiyomizu-dera"],
        packingList: ["Socks (for temple floors)", "Suica card", "Camera", "Comfortable walking shoes", "Japanese yen"],
        images: [
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
            "https://images.unsplash.com/photo-1476124369491-e7addf5db371",
            "https://images.unsplash.com/photo-1545569341-9eb8b30979d9"
        ],
        category: "Things to Do",
        continent: "Asia",
        expense: "Mid-range",
        tags: ["Culture", "History", "Nature"]
    },
    {
        name: "Dubai, UAE",
        details: "A city of superlatives, defined by its ultramodern architecture, luxury shopping, and desert adventures.",
        whatToDo: ["Visit Burj Khalifa", "Shop at Dubai Mall", "Go on a Desert Safari", "Explore the Gold Souk", "Relax at Palm Jumeirah"],
        packingList: ["Light linen clothing", "Modest attire for public areas", "Sunglasses", "Sunblock", "Formal evening wear"],
        images: [
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
            "https://images.unsplash.com/photo-1518684079-3c830dcef090",
            "https://images.unsplash.com/photo-1526495124232-a02e1849118a"
        ],
        category: "Things to Do",
        continent: "Asia",
        expense: "Luxury",
        tags: ["Modern", "Shopping", "Desert"]
    },
    // NORTH AMERICA
    {
        name: "Mexico City, Mexico",
        details: "A sprawling metropolis with a rich history, vibrant art scene, and legendary cuisine.",
        whatToDo: ["Visit Anthropology Museum", "Explore Chapultepec Park", "See Frida Kahlo Museum", "Climb Teotihuacan Pyramids", "Eat tacos al pastor"],
        packingList: ["Comfortable sneakers", "Sun hat", "Power bank", "Small bills for tips", "Light sweater"],
        images: [
            "https://images.unsplash.com/photo-1518105779142-d975fb23a3db",
            "https://images.unsplash.com/photo-1585464231473-d36d20d3b918",
            "https://images.unsplash.com/photo-1512813583141-b9211fb62e64"
        ],
        category: "Things to Do",
        continent: "North America",
        expense: "Budget",
        tags: ["History", "Food", "Art"]
    },
    {
        name: "Vancouver, Canada",
        details: "A coastal seaport city surrounded by mountains, with a thriving art, theater, and music scene.",
        whatToDo: ["Walk through Stanley Park", "Cross Capilano Suspension Bridge", "Explore Granville Island", "Visit Grouse Mountain", "Cycle the Seawall"],
        packingList: ["Rain gear", "Hiking boots", "Multi-layered clothing", "Binoculars", "Water bottle"],
        images: [
            "https://images.unsplash.com/photo-1559511260-66a654ae982a",
            "https://images.unsplash.com/photo-1560814304-4f05b62af116",
            "https://images.unsplash.com/photo-1524820197278-540916411e20"
        ],
        category: "Things to Do",
        continent: "North America",
        expense: "Mid-range",
        tags: ["Nature", "Outdoors", "Ocean"]
    },
    {
        name: "New Orleans, USA",
        details: "A melting pot of French, African, and American cultures, famous for jazz, spicy food, and Mardi Gras.",
        whatToDo: ["Listen to jazz on Frenchmen Street", "Eat beignets at Cafe Du Monde", "Explore the Garden District", "Take a swamp tour", "Walk through Jackson Square"],
        packingList: ["Comfortable party shoes", "Hand fan", "Rain poncho", "Sunglasses", "Festival gear"],
        images: [
            "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
            "https://images.unsplash.com/photo-1473042904451-00109fa624d0",
            "https://images.unsplash.com/photo-1496307361250-3b264b34594c"
        ],
        category: "Things to Do",
        continent: "North America",
        expense: "Mid-range",
        tags: ["Music", "Food", "History"]
    },
    {
        name: "Hawai'i (Oahu), USA",
        details: "A tropical paradise featuring Waikiki Beach, historic Pearl Harbor, and the dramatic North Shore waves.",
        whatToDo: ["Surf in Waikiki", "Visit Pearl Harbor", "Hike Diamond Head", "Explore North Shore", "Attend a Luau"],
        packingList: ["Swimwear", "Flip flops", "Reef-safe sunscreen", "Underwater camera", "Snorkel gear"],
        images: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            "https://images.unsplash.com/photo-1473307844400-9da610664ee6",
            "https://images.unsplash.com/photo-1505852324029-482df7336fa7"
        ],
        category: "Things to Do",
        continent: "North America",
        expense: "Luxury",
        tags: ["Beach", "Nature", "Surfing"]
    },
    // SOUTH AMERICA
    {
        name: "Rio de Janeiro, Brazil",
        details: "A city of peaks, beaches, and sambas, set against one of the most beautiful harbors in the world.",
        whatToDo: ["See Christ the Redeemer", "Ride cable car to Sugarloaf Mountain", "Relax on Ipanema Beach", "Visit Santa Teresa neighborhood", "See the Escadaria Selarón"],
        packingList: ["Bright swimwear", "Sun hat", "Sturdy sandals", "Waterproof bag", "Light evening wear"],
        images: [
            "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
            "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f",
            "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e"
        ],
        category: "Things to Do",
        continent: "South America",
        expense: "Mid-range",
        tags: ["Beach", "Nightlife", "Iconic"]
    },
    {
        name: "Cusco, Peru",
        details: "Once the capital of the Inca Empire, Cusco is now a stunning blend of colonial and ancient architecture.",
        whatToDo: ["Visit Machu Picchu", "Explore the Sacred Valley", "Walk through the San Blas district", "See Saqsaywaman", "Eat local Cuy (guinea pig)"],
        packingList: ["Altitude sickness pills", "Hiking boots", "Raincoat", "Warm layers (it gets cold!)", "US dollars for exchange"],
        images: [
            "https://images.unsplash.com/photo-1587595305378-59748bfbe070",
            "https://images.unsplash.com/photo-1526392060635-9d6019884377",
            "https://images.unsplash.com/photo-1544918877-460635b6d13e"
        ],
        category: "Things to Do",
        continent: "South America",
        expense: "Mid-range",
        tags: ["History", "Hiking", "Culture"]
    },
    {
        name: "Buenos Aires, Argentina",
        details: "The 'Paris of South America,' known for its European architecture, steak culture, and the Tango.",
        whatToDo: ["See a Tango show in San Telmo", "Visit Recoleta Cemetery", "Explore La Boca's Caminito", "Eat at a Parrilla (steakhouse)", "Stroll through Palermo parks"],
        packingList: ["Dancing shoes", "Smart clothes for dinner", "Spanish phrasebook (with 'vos')", "US Dollars (Blue Dollar exchange)", "Camera"],
        images: [
            "https://images.unsplash.com/photo-1589909202802-8f4aadce1849",
            "https://images.unsplash.com/photo-1533083651139-4d6d6289b53f",
            "https://images.unsplash.com/photo-1518105779142-d975fb23a3db"
        ],
        category: "Things to Do",
        continent: "South America",
        expense: "Mid-range",
        tags: ["Culture", "Food", "Dance"]
    },
    // AFRICA
    {
        name: "Marrakech, Morocco",
        details: "A sensory overload of markets, ancient palaces, and beautiful gardens at the foot of the Atlas Mountains.",
        whatToDo: ["Explore Jemaa el-Fnaa", "Visit Majorelle Garden", "Get lost in the Souks", "Stay in a Riad", "See the Koutoubia Mosque"],
        packingList: ["Modest clothing", "Comfortable sandals", "Reusable bag", "Hand sanitizer", "Dirhams (local cash)"],
        images: [
            "https://images.unsplash.com/photo-1548013146-72479768bada",
            "https://images.unsplash.com/photo-1539020140153-e479b8c22e70",
            "https://images.unsplash.com/photo-1538330621152-4f1836d529b2"
        ],
        category: "Things to Do",
        continent: "Africa",
        expense: "Mid-range",
        tags: ["Culture", "Shopping", "Adventure"]
    },
    {
        name: "Cape Town, South Africa",
        details: "A multi-cultural coastal city with the iconic Table Mountain and stunning vineyards nearby.",
        whatToDo: ["Go up Table Mountain", "Visit Robben Island", "See the penguins at Boulders Beach", "Drink wine in Stellenbosch", "Drive Chapman's Peak"],
        packingList: ["Windbreaker", "Sturdy hiking shoes", "Sunblock", "Binoculars", "Camera with zoom"],
        images: [
            "https://images.unsplash.com/photo-1580619305218-8423ef8cf7db",
            "https://images.unsplash.com/photo-1576085834041-da796a4a9840",
            "https://images.unsplash.com/photo-1518105779142-d975fb23a3db"
        ],
        category: "Things to Do",
        continent: "Africa",
        expense: "Mid-range",
        tags: ["Nature", "Outdoors", "Wildlife"]
    },
    {
        name: "Cairo, Egypt",
        details: "Home to the Giza Pyramid Complex and some of the world's most impressive ancient treasures.",
        whatToDo: ["See the Great Pyramids of Giza", "Explore the Egyptian Museum", "Shop at Khan el-Khalili", "Visit the Cairo Citadel", "Take a Felucca on the Nile"],
        packingList: ["Modest cotton clothes", "SPF 50 Sunscreen", "Sunglasses", "Power bank", "Small coins for baksheesh"],
        images: [
            "https://images.unsplash.com/photo-1572252017416-2244a2b2981d",
            "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
            "https://images.unsplash.com/photo-1553913861-c0fddf2619ee"
        ],
        category: "Things to Do",
        continent: "Africa",
        expense: "Budget",
        tags: ["History", "Iconic", "Adventure"]
    },
    {
        name: "Zanzibar, Tanzania",
        details: "An archipelago off the coast of East Africa, known for Stone Town and its white-sand beaches.",
        whatToDo: ["Wander Stone Town", "Snorkel at Mnemba Atoll", "Visit Jozani Forest", "Take a Spice Tour", "Dinner at The Rock Restaurant"],
        packingList: ["Water shoes", "Snorkel mask", "Loose clothing", "Waterproof dry bag", "Swimwear"],
        images: [
            "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe",
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
            "https://images.unsplash.com/photo-1473307844400-9da610664ee6"
        ],
        category: "Things to Do",
        continent: "Africa",
        expense: "Mid-range",
        tags: ["Beach", "History", "Nature"]
    },
    // OCEANIA
    {
        name: "Sydney, Australia",
        details: "An iconic harbor city with the famous Opera House, beautiful beaches, and a vibrant dining scene.",
        whatToDo: ["See the Opera House", "Walk from Bondi to Coogee", "Climb the Harbor Bridge", "Ferry to Manly", "Wander The Rocks"],
        packingList: ["High SPF sunscreen", "Swimwear", "Wide-brim hat", "Opal card", "Light jacket"],
        images: [
            "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
            "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
            "https://images.unsplash.com/photo-1524820197278-540916411e20"
        ],
        category: "Things to Do",
        continent: "Australia",
        expense: "Luxury",
        tags: ["Beach", "Iconic", "Outdoors"]
    },
    {
        name: "Queenstown, New Zealand",
        details: "The adventure capital of the world, nestled against breathtaking mountains and Lake Wakatipu.",
        whatToDo: ["Bungy jump", "Ride the Skyline Gondola", "Take a cruise on Milford Sound", "Ski at The Remarkables", "Eat a Fergburger"],
        packingList: ["Sturdy outdoor gear", "Warm layers", "GoPro camera", "Sunblock", "Comfortable sneakers"],
        images: [
            "https://images.unsplash.com/photo-1589802829985-817e51181b92",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
            "https://images.unsplash.com/photo-1583592167154-15f5c86f0012"
        ],
        category: "Things to Do",
        continent: "Australia",
        expense: "Mid-range",
        tags: ["Adventure", "Nature", "Hiking"]
    },
    {
        name: "Bora Bora, French Polynesia",
        details: "A luxury island destination famous for its scuba diving and turquoise lagoon.",
        whatToDo: ["Stay in an overwater bungalow", "Snorkel with sharks and rays", "Explore Matira Beach", "4x4 Jeep Safari", "Candlelit dinner"],
        packingList: ["Luxury swimwear", "Underwater camera", "Coral-safe sunblock", "Evening island wear", "Snorkel fin"],
        images: [
            "https://images.unsplash.com/photo-1533105079780-92b9be482077",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            "https://images.unsplash.com/photo-1559131334-08f36c1e54c8"
        ],
        category: "Hotels",
        continent: "Australia",
        expense: "Luxury",
        tags: ["Beach", "Romance", "Ocean"]
    },
    // ADDING MORE FOR THE 50+ COUNT (SHORTHAND)
    {
        name: "Madrid, Spain",
        details: "A cultural hub with world-class museums and high-energy nightlife.",
        whatToDo: ["Prado Museum", "Retiro Park", "Royal Palace", "Tapas in La Latina", "Puerta del Sol"],
        packingList: ["City map", "Walking shoes", "Evening wear", "Sunglasses", "Spanish phrasebook"],
        images: ["https://images.unsplash.com/photo-1539037116277-4db20889f2d4", "https://images.unsplash.com/photo-1543783232-af412b852fc7", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Mid-range",
        tags: ["Culture", "Nightlife"]
    },
    {
        name: "Berlin, Germany",
        details: "A city of grit and glory, known for its political history and edgy underground scene.",
        whatToDo: ["Brandenburg Gate", "East Side Gallery", "Museum Island", "Checkpoint Charlie", "Berghain Club"],
        packingList: ["Black clothes", "Rain jacket", "Bicycle map", "ID card", "Euro cash"],
        images: ["https://images.unsplash.com/photo-1560969184-10fe8719e047", "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f", "https://images.unsplash.com/photo-1467269204594-9661b134dd2b"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Mid-range",
        tags: ["History", "Nightlife"]
    },
    {
        name: "Lisbon, Portugal",
        details: "A sunny, hilly city with colorful tiled buildings and fado music echoing through the streets.",
        whatToDo: ["Ride Tram 28", "Visit Belém Tower", "Explore Alfama", "Pastel de Nata in Belém", "Day trip to Sintra"],
        packingList: ["Shoes with grip (hills!)", "Sunglasses", "Camera", "Light jacket", "Portuguese phrasebook"],
        images: ["https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4", "https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Budget",
        tags: ["Culture", "Food", "Hills"]
    },
    {
        name: "Vienna, Austria",
        details: "The city of music and cakes, famous for its imperial palaces and classical heritage.",
        whatToDo: ["Schönbrunn Palace", "State Opera", "St. Stephen's Cathedral", "Visit a Coffee House", "Prater Amusement Park"],
        packingList: ["Dress clothes", "Walking shoes", "German phrasebook", "Umbrella", "Coin purse"],
        images: ["https://images.unsplash.com/photo-1516550893923-42d28e5677af", "https://images.unsplash.com/photo-1527685609192-f04bf08ce5f2", "https://images.unsplash.com/photo-1518105779142-d975fb23a3db"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Luxury",
        tags: ["Music", "History", "Coffee"]
    },
    {
        name: "Budapest, Hungary",
        details: "A stunning city split by the Danube, famous for its ruin bars and thermal baths.",
        whatToDo: ["Parliament Building", "Széchenyi Thermal Bath", "Fisherman's Bastion", "Ruin Bars in Jewish Quarter", "Margaret Island"],
        packingList: ["Swimsuit", "Flip flops", "Camera", "Walking shoes", "Hungarian Forint"],
        images: ["https://images.unsplash.com/photo-1518105779142-d975fb23a3db", "https://images.unsplash.com/photo-1506450983818-bc6bd03126f1", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Budget",
        tags: ["Baths", "Nightlife", "River"]
    },
    {
        name: "Stockholm, Sweden",
        details: "An archipelago city of 14 islands, blending modern design with a medieval old town.",
        whatToDo: ["Gamla Stan", "Vasa Museum", "ABBA The Museum", "Take a boat tour", "Skansen Open-Air Museum"],
        packingList: ["Layers", "Card payment ready (cashless city)", "Stylish sneakers", "Sunglasses", "Winter coat (winter!)"],
        images: ["https://images.unsplash.com/photo-1509356843151-3e7d96241e11", "https://images.unsplash.com/photo-1473307844400-9da610664ee6", "https://images.unsplash.com/photo-1548013146-72479768bada"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Luxury",
        tags: ["Design", "Ocean", "Modern"]
    },
    {
        name: "Mumbai, India",
        details: "The city of dreams, a bustling hub of cinema, history, and incredible street food.",
        whatToDo: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Colaba Causeway", "Dhobi Ghat"],
        packingList: ["Lightweight cottons", "Hand sanitizer", "Power bank", "Small change", "Camera"],
        images: ["https://images.unsplash.com/photo-1529250830199-42c24126f198", "https://images.unsplash.com/photo-1562979314-bee7453e911c", "https://images.unsplash.com/photo-1566552881560-0be13e89c164"],
        category: "Things to Do",
        continent: "Asia",
        expense: "Budget",
        tags: ["Culture", "Food", "History"]
    },
    {
        name: "Hanoi, Vietnam",
        details: "An ancient city with colonial architecture and a world-famous coffee culture.",
        whatToDo: ["Old Quarter tour", "Hoan Kiem Lake", "Ha Long Bay day trip", "Temple of Literature", "Eat Pho on the street"],
        packingList: ["Light rain jacket", "Walking sandals", "Earplugs (traffic!)", "Bug spray", "US Dollars for backup"],
        images: ["https://images.unsplash.com/photo-1509030450996-af3c2e0d4420", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", "https://images.unsplash.com/photo-1559592413-7cea83781cbd"],
        category: "Things to Do",
        continent: "Asia",
        expense: "Budget",
        tags: ["Food", "History", "River"]
    },
    {
        name: "Siem Reap, Cambodia",
        details: "The gateway to the ruins of Angkor, the seat of the Khmer Kingdom.",
        whatToDo: ["Angkor Wat at sunrise", "Bayon Temple", "Ta Prohm (Jungle Temple)", "Pub Street", "Floating Villages"],
        packingList: ["Modest temple clothes", "Sun hat", "Bug spray", "Wipes", "Camera"],
        images: ["https://images.unsplash.com/photo-1500048993953-d23a436266cf", "https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1473307844400-9da610664ee6"],
        category: "Things to Do",
        continent: "Asia",
        expense: "Budget",
        tags: ["History", "Temples", "Adventure"]
    },
    {
        name: "Taipei, Taiwan",
        details: "A city known for its bustling night markets, vibrant street food, and Taipei 101 skyscraper.",
        whatToDo: ["Taipei 101", "Shilin Night Market", "Chiang Kai-shek Memorial", "Elephant Mountain hike", "Hot Springs in Beitou"],
        packingList: ["Easy-card", "Rain gear", "Walking shoes", "Camera", "Reusable bottle"],
        images: ["https://images.unsplash.com/photo-1583422409516-2895a77efded", "https://images.unsplash.com/photo-1533083651139-4d6d6289b53f", "https://images.unsplash.com/photo-1518105779142-d975fb23a3db"],
        category: "Things to Do",
        continent: "Asia",
        expense: "Mid-range",
        tags: ["Food", "Modern", "Nature"]
    },
    {
        name: "Petra, Jordan",
        details: "An archaeological city famous for its rock-cut architecture and water conduit system.",
        whatToDo: ["The Treasury", "The Monastery", "Hiking the Siq", "Petra by Night", "Wadi Rum excursion"],
        packingList: ["Hiking boots", "Scarf (Keffiyeh)", "Sun protection", "Plenty of water", "Camera"],
        images: ["https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1533105079780-92b9be482077", "https://images.unsplash.com/photo-1559592413-7cea83781cbd"],
        category: "Things to Do",
        continent: "Asia",
        expense: "Mid-range",
        tags: ["History", "Hiking", "Adventure"]
    },
    {
        name: "Osaka, Japan",
        details: "Japan's food capital, known for modern architecture and street food culture.",
        whatToDo: ["Dotonbori district", "Osaka Castle", "Universal Studios Japan", "Umeda Sky Building", "Shinsekai area"],
        packingList: ["Stomach meds (lots of food!)", "Walking shoes", "IC card", "Camera", "Rain jacket"],
        images: ["https://images.unsplash.com/photo-1542051841857-5f90071e7989", "https://images.unsplash.com/photo-1533105079780-92b9be482077", "https://images.unsplash.com/photo-1473307844400-9da610664ee6"],
        category: "Things to Do",
        continent: "Asia",
        expense: "Mid-range",
        tags: ["Food", "Modern", "Iconic"]
    },
    {
        name: "Toronto, Canada",
        details: "A dynamic metropolis with a core of soaring skyscrapers and many green spaces.",
        whatToDo: ["CN Tower", "Royal Ontario Museum", "Toronto Islands", "Distillery District", "St. Lawrence Market"],
        packingList: ["Winter gear (if winter)", "Walking shoes", "Light jacket", "Smartphone with map", "Credit card"],
        images: ["https://images.unsplash.com/photo-1502021681706-4c174eaf6e7b", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800", "https://images.unsplash.com/photo-1559592413-7cea83781cbd"],
        category: "Things to Do",
        continent: "North America",
        expense: "Mid-range",
        tags: ["Modern", "Culture", "Iconic"]
    },
    {
        name: "Havana, Cuba",
        details: "A city frozen in time with vintage cars and colorful Spanish colonial architecture.",
        whatToDo: ["Old Havana (Habana Vieja)", "Ride a classic car", "Walk the Malecón", "El Capitolio", "Salsa dancing at a club"],
        packingList: ["Cash (US Dollars/Euros)", "First aid kit", "Snacks", "Spanish phrasebook", "Offline maps"],
        images: ["https://images.unsplash.com/photo-1504192328623-64a66269666c", "https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"],
        category: "Things to Do",
        continent: "North America",
        expense: "Budget",
        tags: ["History", "Culture", "Dance"]
    },
    {
        name: "Cancun, Mexico",
        details: "A Mexican city on the Yucatan Peninsula bordering the Caribbean Sea, known for its beaches and resorts.",
        whatToDo: ["Beach day in Hotel Zone", "Chichén Itzá day trip", "Snorkeling in Cenotes", "Coco Bongo nightclub", "Isla Mujeres trip"],
        packingList: ["Swimwear", "Water shoes", "Sunblock", "Party clothes", "US Dollars/Pesos"],
        images: ["https://images.unsplash.com/photo-1552074284-5e88ef1aef18", "https://images.unsplash.com/photo-1533105079780-92b9be482077", "https://images.unsplash.com/photo-1473307844400-9da610664ee6"],
        category: "Hotels",
        continent: "North America",
        expense: "Mid-range",
        tags: ["Beach", "Resort", "Nightlife"]
    },
    {
        name: "Cartagena, Colombia",
        details: "A fairy-tale city on the Caribbean coast with a walled Old Town and colorful architecture.",
        whatToDo: ["Walled City walk", "Castillo San Felipe de Barajas", "Playa Blanca", "Getsemaní neighborhood", "Rosario Islands trip"],
        packingList: ["Lightweight clothes", "Sun hat", "Sandals", "Sunglasses", "Bug spray"],
        images: ["https://images.unsplash.com/photo-1542051841857-5f90071e7989", "https://images.unsplash.com/photo-1583422409516-2895a77efded", "https://images.unsplash.com/photo-1533083651139-4d6d6289b53f"],
        category: "Things to Do",
        continent: "South America",
        expense: "Budget",
        tags: ["History", "Beach", "Color"]
    },
    {
        name: "Galapagos Islands, Ecuador",
        details: "A volcanic archipelago in the Pacific Ocean, considered one of the world's foremost destinations for wildlife-viewing.",
        whatToDo: ["Snorkel with sea lions", "See Giant Tortoises", "Hike volcanic craters", "Kayaking in lagoons", "Darwin Research Center"],
        packingList: ["Binoculars", "Underwater camera", "Reef-safe sunblock", "Hiking shoes", "Dry bag"],
        images: ["https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "https://images.unsplash.com/photo-1559592413-7cea83781cbd"],
        category: "Things to Do",
        continent: "South America",
        expense: "Luxury",
        tags: ["Wildlife", "Nature", "Ocean"]
    },
    {
        name: "Lima, Peru",
        details: "The Gastronomical Capital of South America, blending colonial heritage with modern seaside vibes.",
        whatToDo: ["Larco Museum", "Stroll Miraflores", "Eat Ceviche in Barranco", "Plaza de Armas", "Visit Huaca Pucllana"],
        packingList: ["Walking sneakers", "Jacket (for mist)", "Spanish phrasebook", "Camera", "Extra stomach space!"],
        images: ["https://images.unsplash.com/photo-1583422409516-2895a77efded", "https://images.unsplash.com/photo-1533083651139-4d6d6289b53f", "https://images.unsplash.com/photo-1518105779142-d975fb23a3db"],
        category: "Restaurants",
        continent: "South America",
        expense: "Mid-range",
        tags: ["Food", "History", "Ocean"]
    },
    {
        name: "Victoria Falls, Zimbabwe",
        details: "One of the Seven Natural Wonders of the World, where the Zambezi River plunges into a deep gorge.",
        whatToDo: ["Walk along the falls edge", "Helicopter ride", "Sunset cruise on Zambezi", "Visit the Big Tree", "Devil's Pool (seasonal)"],
        packingList: ["Raincoat", "Waterproof camera", "Bug spray", "Sunscreen", "Small bills for tips"],
        images: ["https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1518105779142-d975fb23a3db", "https://images.unsplash.com/photo-1533105079780-92b9be482077"],
        category: "Things to Do",
        continent: "Africa",
        expense: "Mid-range",
        tags: ["Nature", "Iconic", "Adventure"]
    },
    {
        name: "Nairobi, Kenya",
        details: "A city where urban life meets wildlife, featuring its own national park just outside the center.",
        whatToDo: ["Nairobi National Park Safari", "Giraffe Centre", "David Sheldrick Elephant Orphanage", "Karen Blixen Museum", "Visit Maasai Market"],
        packingList: ["Natural tone clothes", "Binoculars", "Camera", "Sun hat", "Water bottle"],
        images: ["https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", "https://images.unsplash.com/photo-1473307844400-9da610664ee6"],
        category: "Things to Do",
        continent: "Africa",
        expense: "Mid-range",
        tags: ["Wildlife", "Safaris", "City"]
    },
    {
        name: "Melbourne, Australia",
        details: "Australia's cultural capital, famous for its hidden laneways, coffee shops, and arts scene.",
        whatToDo: ["Explore Laneways & Street Art", "Federation Square", "Great Ocean Road trip", "St Kilda Beach", "Queen Victoria Market"],
        packingList: ["Layers (4 seasons in one day!)", "Umbrella", "Stylish sneakers", "Camera", "Smart card (Myki)"],
        images: ["https://images.unsplash.com/photo-1514395462725-fb4566210144", "https://images.unsplash.com/photo-1533083651139-4d6d6289b53f", "https://images.unsplash.com/photo-1518105779142-d975fb23a3db"],
        category: "Things to Do",
        continent: "Australia",
        expense: "Mid-range",
        tags: ["Culture", "Coffee", "Art"]
    },
    {
        name: "Auckland, New Zealand",
        details: "The City of Sails, built on a volcanic field and surrounded by beautiful harbors.",
        whatToDo: ["Sky Tower", "Waiheke Island Wine Tasting", "Mission Bay", "Hike Mount Eden", "Explore Viaduct Harbour"],
        packingList: ["Weatherproof gear", "Comfortable hikers", "Swimwear", "Camera", "Sun hat"],
        images: ["https://images.unsplash.com/photo-1507699622108-4be3abd695ad", "https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"],
        category: "Things to Do",
        continent: "Australia",
        expense: "Mid-range",
        tags: ["Ocean", "Nature", "City"]
    },
    {
        name: "Antarctica (Expedition)",
        details: "The ultimate frontier, home to icebergs, penguins, and untouched wilderness.",
        whatToDo: ["Visit Penguin Colonies", "See Humpback Whales", "Kayak through Icebergs", "Polar Plunge", "Drake Passage crossing"],
        packingList: ["Thermal layers", "Waterproof boots", "Polarized sunglasses", "GoPro", "Motion sickness pills"],
        images: ["https://images.unsplash.com/photo-1516077763924-1936452298bc", "https://images.unsplash.com/photo-1551244072-5d12891f1c24", "https://images.unsplash.com/photo-1473307844400-9da610664ee6"],
        category: "Travel Stories",
        continent: "Antarctica",
        expense: "Luxury",
        tags: ["Extreme", "Wildlife", "Nature"]
    },
    {
        name: "Florence, Italy",
        details: "The birthplace of the Renaissance, home to world-famed masterpieces of art and architecture.",
        whatToDo: ["Uffizi Gallery", "Duomo (Santa Maria del Fiore)", "Ponte Vecchio", "Piazzale Michelangelo", "Accademia Gallery (David)"],
        packingList: ["Elegant walking shoes", "Scarf for churches", "Camera", "Power adapter", "Euros"],
        images: ["https://images.unsplash.com/photo-1543428802-1d48c27a3c3e", "https://images.unsplash.com/photo-1533083651139-4d6d6289b53f", "https://images.unsplash.com/photo-1518105779142-d975fb23a3db"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Mid-range",
        tags: ["Art", "History", "Renaissance"]
    },
    {
        name: "Venice, Italy",
        details: "The floating city, built on 118 small islands separated by canals and linked by bridges.",
        whatToDo: ["St. Mark's Square", "Gondola ride", "Rialto Bridge", "Doge's Palace", "Day trip to Burano"],
        packingList: ["Shoes for water (high tide)", "Map (getting lost is likely!)", "Power bank", "Camera", "Sun hat"],
        images: ["https://images.unsplash.com/photo-1514890547357-a9ee2887ad85", "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9", "https://images.unsplash.com/photo-1473307844400-9da610664ee6"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Luxury",
        tags: ["Iconic", "Romance", "History"]
    },
    {
        name: "Santorini, Greece",
        details: "A volcanic island in the Cyclades, famous for its blue-domed churches and world-class sunsets.",
        whatToDo: ["Watch sunset in Oia", "Hike from Fira to Oia", "Boat tour of Caldera", "Explore Red Beach", "Ancient Akrotiri"],
        packingList: ["White/Blue outfits (photos)", "Sandals", "Sunglasses", "Sunscreen", "Beach bag"],
        images: ["https://images.unsplash.com/photo-1570077180053-5696d00062f6", "https://images.unsplash.com/photo-1583422409516-2895a77efded", "https://images.unsplash.com/photo-1533083651139-4d6d6289b53f"],
        category: "Hotels",
        continent: "Europe",
        expense: "Luxury",
        tags: ["Beach", "Romance", "Island"]
    },
    {
        name: "Mykonos, Greece",
        details: "A glamorous Greek island known for its vibrant nightlife and beautiful sandy beaches.",
        whatToDo: ["Explore Little Venice", "Windmills of Kato Mili", "Paradise Beach Party", "Shopping in Chora", "Boat trip to Delos"],
        packingList: ["Party clothes", "Swimwear", "Sunscreen", "Camera", "Stylish sunglasses"],
        images: ["https://images.unsplash.com/photo-1601581875309-fadbc5d3d1f1", "https://images.unsplash.com/photo-1548013146-72479768bada", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"],
        category: "Things to Do",
        continent: "Europe",
        expense: "Luxury",
        tags: ["Nightlife", "Beach", "Glamour"]
    }
];

// Define Schema matching the enlarged Destination model
const DestinationSchema = new mongoose.Schema({
    name: String,
    details: String,
    whatToDo: [String],
    packingList: [String],
    images: [String],
    category: String,
    continent: String,
    expense: String,
    tags: [String]
}, { timestamps: true });

const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);

async function seedDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, { dbName: 'travel_users' });
        console.log('Connected!');

        console.log('Clearing existing destinations...');
        await Destination.deleteMany({});

        console.log(`Inserting ${destinations.length} destinations...`);
        await Destination.insertMany(destinations);

        console.log('✅ Database seeded with 50+ destinations successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
}

seedDB();
