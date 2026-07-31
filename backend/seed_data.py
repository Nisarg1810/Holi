import os
import sys
import django

# Setup Django environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from helicopters.models import Helicopter
from packages.models import Tour
from hotels.models import Hotel
from boats.models import Boat

def seed_helicopters():
    Helicopter.objects.all().delete()
    helicopters = [
        Helicopter(
            id="h-1",
            name="Himalayan Sanctuary Charter",
            model="Airbus H145 luxury",
            tagline="Uncompromising comfort for elite high-altitude excursions",
            price=245000,
            capacity=4,
            speed="240 km/h",
            range="650 km",
            safety_rating="5.0/5.0",
            description="The Airbus H145 is the pinnacle of luxury aviation engineering. Featuring a spacious, vibration-isolated executive cabin, club-seating configurations, and large panoramic windows, it is the premier choice for VIP transfers to holy sanctuaries and high-altitude mountain locations.",
            image="https://images.unsplash.com/photo-1681281896815-bfa3b9b47e2b?q=80&w=600&auto=format&fit=crop",
            features=["Noise Cancellation Cabin", "Climate Control", "Panoramic Glass Windows", "Refreshment Bar", "VIP Lounge Boarding"],
            specs={
                "Engine Type": "Dual Safran Arriel 2E (Twin-Engine)",
                "Max Takeoff Weight": "3,700 kg",
                "Cabin Volume": "6.0 m³",
                "Avionics Suite": "Helionix digital cockpit",
                "Altitude Ceiling": "20,000 ft",
            },
            schedules=["07:30 AM", "09:45 AM", "01:30 PM", "04:15 PM"]
        ),
        Helicopter(
            id="h-2",
            name="Amalfi Coastline Interceptor",
            model="Bell 429 GlobalRanger",
            tagline="Twin-engine security combined with elegant Italian design aesthetics",
            price=185000,
            capacity=6,
            speed="273 km/h",
            range="720 km",
            safety_rating="4.9/5.0",
            description="Perfect for coastal cruising and dynamic island hopping. The Bell 429 offers state-of-the-art flight dynamics with an expansive flat-floor cabin that accommodates up to six passengers in full executive luxury.",
            image="https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=600&auto=format&fit=crop",
            features=["Leather Club Seats", "LED Ambient Lighting", "Integrated Bluetooth Audio", "Extra Luggage Space", "Premium Snacks"],
            specs={
                "Engine Type": "Pratt & Whitney PW207D1 (Twin-Engine)",
                "Max Takeoff Weight": "3,175 kg",
                "Cabin Volume": "5.8 m³",
                "Avionics Suite": "BFE Integrated Flight deck",
                "Altitude Ceiling": "18,700 ft",
            },
            schedules=["08:00 AM", "11:00 AM", "02:30 PM", "05:00 PM"]
        ),
        Helicopter(
            id="h-3",
            name="Urban VIP Shuttle",
            model="AgustaWestland AW109",
            tagline="Swift, aerodynamic executive transport for business and transit",
            price=160000,
            capacity=5,
            speed="285 km/h",
            range="930 km",
            safety_rating="4.9/5.0",
            description="Built for speed and sleek aesthetic refinement, the AW109 features a highly retractable landing gear and aerodynamically streamlined build. Navigate urban traffic lanes and regional flyovers instantly.",
            image="https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=600&auto=format&fit=crop",
            features=["Super Silent Blades", "Mini Dining Table", "In-flight Wi-Fi", "Champagne Service", "Concierge Assist"],
            specs={
                "Engine Type": "Pratt & Whitney PW206C (Twin-Engine)",
                "Max Takeoff Weight": "3,000 kg",
                "Cabin Volume": "5.0 m³",
                "Avionics Suite": "Collins 3-Axis Duplex Autopilot",
                "Altitude Ceiling": "15,000 ft",
            },
            schedules=["09:00 AM", "12:15 PM", "03:00 PM", "06:30 PM"]
        )
    ]
    Helicopter.objects.bulk_create(helicopters)
    print(f"Seeded {len(helicopters)} Helicopters into PostgreSQL")

def seed_tours():
    Tour.objects.all().delete()
    tours = [
        Tour(
            id="p-1",
            name="Himalayan Sacred Peaks Pilgrimage",
            tagline="VIP Char Dham Helicopter Circuit | 5 Days / 4 Nights",
            price=195000,
            duration="5 Days / 4 Nights",
            rating=5.0,
            image="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
            inclusions=["Private Helicopter Transfers", "Luxury 5★ Resort Stays", "VIP Temple Darshan Passes", "Personalized Butler & Escort", "All Gourmet Meals"],
            exclusions=["Personal Gratuitous Tips", "Extra Heavy Luggage (>5kg)", "Unscheduled Extra Stays"],
            itinerary=[
                {"day": 1, "title": "Arrival in Dehradun", "desc": "Welcome dinner at JW Marriott Mussoorie with briefing.", "stay": "JW Marriott Mussoorie", "transport": "Luxury SUV"},
                {"day": 2, "title": "Dehradun ➔ Yamunotri ➔ Gangotri", "desc": "Morning charter flight to Kharsali helipad and VIP darshan.", "stay": "Himalayan Sanctuary Resort", "transport": "Airbus H145"},
                {"day": 3, "title": "Kedarnath Sanctuary VIP Visit", "desc": "Fly to Phata helipad and direct shuttle to Kedarnath temple doorstep.", "stay": "Kedarnath Eco Suites", "transport": "Airbus H145"},
                {"day": 4, "title": "Badrinath Shrine & Mana Village", "desc": "Morning flight to Badrinath. Special Maha Aarti darshan.", "stay": "Sarovar Portico Badrinath", "transport": "Airbus H145"},
                {"day": 5, "title": "Return Departure to Dehradun", "desc": "Scenic morning return flyover with souvenir photo gift.", "stay": "N/A", "transport": "Airbus H145"}
            ]
        ),
        Tour(
            id="p-2",
            name="Goa Coastal Sun & Azure Waves",
            tagline="Private Helicopter Shoreline Tour & Luxury Yacht Cruise",
            price=85000,
            duration="3 Days / 2 Nights",
            rating=4.9,
            image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
            inclusions=["Coastline Aerial Helicopter Flight", "Private Yacht Sunset Cruise", "Taj Fort Aguada Stay", "Seafood Tasting Experience"],
            exclusions=["Alcoholic Beverages", "Water Sports Add-ons"],
            itinerary=[
                {"day": 1, "title": "Helicopter Aerial Arrival", "desc": "Scenic aerial transfer from Goa airport to Aguada beachfront helipad.", "stay": "Taj Fort Aguada Resort", "transport": "Bell 429 Helicopter"},
                {"day": 2, "title": "Private Yacht Sunset Charter", "desc": "Board Azure Voyager yacht for Mandovi river and Arabian sea cruise.", "stay": "Taj Fort Aguada Resort", "transport": "Luxury Catamaran"},
                {"day": 3, "title": "Beachside Brunch & Departure", "desc": "Relaxing spa morning and chauffeur drop back.", "stay": "N/A", "transport": "Luxury Chauffeur Car"}
            ]
        ),
        Tour(
            id="p-3",
            name="Dwarka – Somnath – Diu Pilgrimage",
            tagline="Private Ertiga Tour | ₹8,500 Per Person (Min 7 Persons Required)",
            price=59500,
            duration="4 Days / 3 Nights",
            rating=5.0,
            image="/dwarka_diu.png",
            inclusions=["Private Suzuki Ertiga for 4 Days", "3 Nights Hotel Stay", "Pure Veg Breakfast & Dinner"],
            exclusions=["Temple Puja Charges", "Personal Laundry & Phone Calls"],
            itinerary=[
                {"day": 1, "title": "Arrival in Ahmedabad ➔ Dwarka", "desc": "Pick up and drive to sacred Dwarka city.", "stay": "Hotel Dwarkadhish", "transport": "Private Ertiga"},
                {"day": 2, "title": "Dwarkadhish Temple & Nageshwar", "desc": "Morning puja and Bet Dwarka boat trip.", "stay": "Hotel Dwarkadhish", "transport": "Private Ertiga"},
                {"day": 3, "title": "Dwarka ➔ Somnath Jyotirlinga", "desc": "Drive to Somnath. Light & sound show at temple.", "stay": "Lords Inn Somnath", "transport": "Private Ertiga"},
                {"day": 4, "title": "Diu Sightseeing & Departure", "desc": "Explore Diu fort and beach before return drop.", "stay": "N/A", "transport": "Private Ertiga"}
            ]
        ),
        Tour(
            id="p-4",
            name="Mahakaleshwar – Ujjain – Omkareshwar",
            tagline="Private Ertiga Tour | ₹7,999 Per Person (Min 7 Persons Required)",
            price=55993,
            duration="3 Days / 2 Nights",
            rating=5.0,
            image="/ujjain_omkareshwar.png",
            inclusions=["Private Suzuki Ertiga for 3 Days", "2 Nights Hotel Stay in Ujjain", "Pure Veg Breakfast & Dinner"],
            exclusions=["Bhasma Aarti Entry Tickets", "Personal Expenses"],
            itinerary=[
                {"day": 1, "title": "Arrival in Indore ➔ Ujjain", "desc": "Pickup from Indore station/airport and transfer to Ujjain.", "stay": "Hotel Rudraksh Ujjain", "transport": "Private Ertiga"},
                {"day": 2, "title": "Mahakaleshwar & Harsiddhi Temple", "desc": "Early morning Bhasma Aarti and Ujjain temples tour.", "stay": "Hotel Rudraksh Ujjain", "transport": "Private Ertiga"},
                {"day": 3, "title": "Excursion to Omkareshwar Jyotirlinga", "desc": "Narmada river boat ride and Omkareshwar temple darshan.", "stay": "N/A", "transport": "Private Ertiga"}
            ]
        )
    ]
    Tour.objects.bulk_create(tours)
    print(f"Seeded {len(tours)} Tour Packages into PostgreSQL")

def seed_hotels():
    Hotel.objects.all().delete()
    hotels = [
        Hotel(
            id="ht-1",
            name="JW Marriott Mussoorie Walnut Grove Resort",
            city="Mussoorie",
            location="Mussoorie, Uttarakhand",
            rating="4.9/5.0",
            stars=5,
            price=28000,
            original_price=35000,
            image="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
            gallery=[
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop"
            ],
            amenities=["Helipad Access", "Luxury Spa", "Valley View Suites", "Heated Pool", "Fine Dining", "Free WiFi"],
            description="Perched amidst the lush Garhwal Himalayas, JW Marriott Mussoorie offers 5-star luxury with panoramic mountain views and private helipad access.",
            tag="GOISAFE LUXURY"
        ),
        Hotel(
            id="ht-2",
            name="Taj Fort Aguada Resort & Spa",
            city="Goa",
            location="Sinquerim, Goa",
            rating="4.8/5.0",
            stars=5,
            price=22000,
            original_price=28000,
            image="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop",
            gallery=[
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
            ],
            amenities=["Beachfront Access", "Infinity Pool", "Private Helipad", "Jiva Spa", "Sea View Dining", "Bar & Lounge"],
            description="India's first luxury beach resort, Taj Fort Aguada blends 16th-century Portuguese heritage with oceanfront luxury and private beachfront helipad transfers.",
            tag="ROMAN PREMIER"
        ),
        Hotel(
            id="ht-3",
            name="Sarovar Portico Badrinath",
            city="Badrinath",
            location="Badrinath, Uttarakhand",
            rating="4.7/5.0",
            stars=4,
            price=15000,
            original_price=18500,
            image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop",
            gallery=[
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop"
            ],
            amenities=["Heated Rooms", "Pure Veg Restaurant", "Temple Escort", "24/7 Oxygen Supply", "Helipad Shuttle"],
            description="Located just 1 km from the sacred Badrinath Temple, Sarovar Portico provides warm Himalayan hospitality and premium comfort for pilgrims.",
            tag="SACRED STAY"
        ),
        Hotel(
            id="ht-4",
            name="The Oberoi Udaivilas",
            city="Udaipur",
            location="Udaipur, Rajasthan",
            rating="5.0/5.0",
            stars=5,
            price=45000,
            original_price=55000,
            image="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop",
            gallery=[
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop"
            ],
            amenities=["Private Boat Arrival", "Lake View Suites", "Royal Spa", "Butler Service", "Helipad Access", "Infinity Pool"],
            tag="ROYAL PALACE"
        )
    ]
    Hotel.objects.bulk_create(hotels)
    print(f"Seeded {len(hotels)} Hotels into PostgreSQL")

def seed_boats():
    Boat.objects.all().delete()
    boats = [
        Boat(
            id="b-1",
            name="Azure Voyager Luxury Yacht",
            type="Executive Catamaran Yacht",
            capacity=12,
            price=45000,
            image="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
            location="Goa Harbor, Panaji, Goa",
            schedules=["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM", "05:30 PM - 08:30 PM (Sunset Cruise)"],
            description="A sleek 45-foot double-deck luxury catamaran yacht featuring a sunbathing deck, air-conditioned saloon, and gourmet dining area. Perfect for corporate events, birthday parties, and romantic sunset cruises along the Goa coastline.",
            features=["Flybridge Sunbed", "Air-Conditioned Saloon", "Gourmet Kitchen Onboard", "Sound System & DJ Setup", "Snorkeling Equipment", "Crew of 4 included"],
            reviews=[
                {"author": "Deepak S.", "rating": 5, "text": "Outstanding yacht. Ideal for sunset cruising with champagne.", "date": "2026-06-10"},
                {"author": "Priya R.", "rating": 5, "text": "Fabulous experience! The crew was amazing and food was delicious.", "date": "2026-06-22"}
            ]
        ),
        Boat(
            id="b-2",
            name="Mandovi Royal Speedboat",
            type="VIP Speedboat",
            capacity=6,
            price=18000,
            image="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop",
            location="Mandovi River, Panjim, Goa",
            schedules=["09:00 AM", "11:30 AM", "03:00 PM"],
            description="High-speed twin-engine speedboat for fast coastal transit and private island hopping around Goa shores. Experience the thrill of riding the waves at up to 60 knots.",
            features=["Twin Yamaha Engines", "Cushioned Seating", "Life Jackets", "Cooler Box", "GoPro Mount Points", "Bluetooth Speaker"],
            reviews=[
                {"author": "Rahul M.", "rating": 5, "text": "What a rush! Best speedboat experience I have had in Goa.", "date": "2026-07-01"}
            ]
        ),
        Boat(
            id="b-3",
            name="Sacred Ganges Shikara Cruise",
            type="Traditional Luxury Shikara",
            capacity=8,
            price=12000,
            image="https://images.unsplash.com/photo-1609946727137-013009587422?q=80&w=600&auto=format&fit=crop",
            location="Dashashwamedh Ghat, Varanasi",
            schedules=["05:30 AM (Sunrise Aarti)", "06:00 PM (Ganga Aarti)"],
            description="Handcrafted wooden shikara boat with velvet seating for peaceful, spiritual river cruises during the evening Ganga Aarti. A transcendent experience on the holy Ganges.",
            features=["Velvet Cushioned Seating", "Flower Petal Decoration", "Aarti Kit Provided", "Photography Assistance", "Spiritual Commentary", "Traditional Chai Service"],
            reviews=[
                {"author": "Anjali T.", "rating": 5, "text": "A truly spiritual and beautiful experience. The Aarti from the river is breathtaking.", "date": "2026-06-18"}
            ]
        ),
        Boat(
            id="b-4",
            name="Kerala Backwaters Sovereign Suite",
            type="Luxury Houseboat",
            capacity=6,
            price=85000,
            image="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop",
            location="Alleppey (Alappuzha) Backwaters, Kerala",
            schedules=["Full Day Charter", "Overnight (24 Hours)"],
            description="A magnificent 70-foot traditional Kerala kettuvallam houseboat with glass-walled lounge, sprawling upper deck, traditional chefs onboard, and full AC cabins. Glide through the serene palm-lined backwaters of Alleppey.",
            features=["Glass-Walled Lounge", "2 AC Cabins", "Traditional Kerala Chef", "Sprawling Upper Deck", "Fishing Rods", "Kayak Available"],
            reviews=[
                {"author": "Priya Menon", "rating": 5, "text": "So peaceful. Floating past coco palms in absolute luxury.", "date": "2026-06-22"},
                {"author": "Kiran B.", "rating": 5, "text": "The Kerala fish curry was phenomenal. Best backwaters trip ever!", "date": "2026-07-10"}
            ]
        ),
        Boat(
            id="b-5",
            name="Andaman Pearl Schooner",
            type="Premium Schooner Yacht",
            capacity=10,
            price=65000,
            image="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&auto=format&fit=crop",
            location="Port Blair Marina, Andaman Islands",
            schedules=["07:00 AM - 01:00 PM (Island Hop)", "02:00 PM - 07:00 PM (Sunset Sail)"],
            description="Sail the crystal-clear turquoise waters of the Andaman Sea on this classic 55-foot schooner. Visit Havelock Island, Neil Island, and Ross Island in a single charter with private snorkeling stops.",
            features=["Island Hopping Route", "Professional Dive Guide", "Snorkel & Mask Sets", "Underwater GoPro", "BBQ Lunch Onboard", "Hammock Net at Bow"],
            reviews=[
                {"author": "Vikram J.", "rating": 5, "text": "Absolutely stunning waters and a magnificent boat. Once-in-a-lifetime experience.", "date": "2026-05-14"}
            ]
        ),
        Boat(
            id="b-6",
            name="Mumbai Harbour Royal Cruise",
            type="Motor Cruiser",
            capacity=20,
            price=35000,
            image="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop",
            location="Gateway of India, Mumbai, Maharashtra",
            schedules=["10:00 AM", "12:30 PM", "04:00 PM", "07:00 PM (Night Cruise)"],
            description="Experience Mumbai's iconic skyline and the Gateway of India from the water on this premium motor cruiser. Perfect for corporate events, product launches, and private parties with stunning city views.",
            features=["Air-Conditioned Deck", "Full Bar Setup", "LED Dance Floor", "Live Music Option", "City Panorama Views", "Photo Booth"],
            reviews=[
                {"author": "Sneha A.", "rating": 5, "text": "Mumbai from the sea is magical. The night cruise with city lights was unforgettable.", "date": "2026-07-05"}
            ]
        ),
    ]
    Boat.objects.bulk_create(boats)
    print(f"Seeded {len(boats)} Boats into PostgreSQL")

if __name__ == "__main__":
    print("=== Seeding database ===")
    seed_helicopters()
    seed_tours()
    seed_hotels()
    seed_boats()
    print("=== Database seeding complete ===")
