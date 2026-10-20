import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

interface SeedProduct {
    name: string;
    brand: string;
    category: string;
    price: number;
    discountPrice?: number;
    stock: number;
    sku: string;
    rating: number;
    reviewCount: number;
    description: string;
}

const PRODUCTS: SeedProduct[] = [
    {
        name: "Aurora Buds Pro Wireless Earbuds",
        brand: "Aurora",
        category: "Electronics",
        price: 4999,
        discountPrice: 3499,
        stock: 120,
        sku: "AUR-BUDS-PRO",
        rating: 4.5,
        reviewCount: 218,
        description:
            "Active noise cancellation, 36-hour battery with the case, Bluetooth 5.3 with low-latency game mode, IPX5 sweat resistance and wireless charging. Four microphones keep calls crisp in traffic.",
    },
    {
        name: "Nimbus 15.6\" Laptop Backpack",
        brand: "Nimbus",
        category: "Fashion",
        price: 1799,
        discountPrice: 1299,
        stock: 84,
        sku: "NIM-BP-156",
        rating: 4.3,
        reviewCount: 512,
        description:
            "Water-rejecting polyester backpack with a padded 15.6-inch laptop sleeve, airflow back panel, luggage strap and a hidden anti-theft pocket. Lifetime zip warranty.",
    },
    {
        name: "ZenCast 65W GaN Fast Charger",
        brand: "ZenCast",
        category: "Electronics",
        price: 2499,
        discountPrice: 1799,
        stock: 210,
        sku: "ZEN-GAN-65",
        rating: 4.6,
        reviewCount: 143,
        description:
            "Two USB-C and one USB-A port, foldable pins, industrial-grade temperature protection and support for USB-PD 3.0 fast charging on phones, tablets and 13-inch laptops.",
    },
    {
        name: "Solstice Ceramic Table Lamp",
        brand: "Solstice",
        category: "Home & Kitchen",
        price: 3299,
        discountPrice: 2599,
        stock: 46,
        sku: "SOL-LAMP-01",
        rating: 4.2,
        reviewCount: 89,
        description:
            "Hand-glazed ceramic base with a linen shade, warm 2700K dimmable LED bulb included and an inline foot switch. A cosy reading light for bedsides and desks.",
    },
    {
        name: "TrailForge Trekking Shoes",
        brand: "TrailForge",
        category: "Footwear",
        price: 3999,
        discountPrice: 2799,
        stock: 64,
        sku: "TRL-TREK-02",
        rating: 4.4,
        reviewCount: 301,
        description:
            "Vibram-style lugged outsole, breathable engineered mesh upper, rock plate under the midfoot and gusseted tongue to keep trail debris out. Sizes UK 6-11.",
    },
    {
        name: "PixelView 27\" 165Hz Gaming Monitor",
        brand: "PixelView",
        category: "Electronics",
        price: 24999,
        discountPrice: 19999,
        stock: 28,
        sku: "PXV-MON-27",
        rating: 4.7,
        reviewCount: 96,
        description:
            "27-inch QHD IPS panel with 165Hz refresh, 1ms MPRT, AMD FreeSync Premium, HDR400 and height-adjustable stand. Two HDMI 2.0 and one DisplayPort input.",
    },
    {
        name: "CasaBrew Espresso Maker 20 Bar",
        brand: "CasaBrew",
        category: "Appliances",
        price: 12999,
        discountPrice: 9499,
        stock: 33,
        sku: "CAB-ESP-20",
        rating: 4.4,
        reviewCount: 174,
        description:
            "20-bar Italian pump, PID temperature control, steam wand for silky microfoam and a 1.8L removable tank. Includes portafilter, tamper and single/double baskets.",
    },
    {
        name: "LumenGlow Vitamin C Serum 30ml",
        brand: "LumenGlow",
        category: "Beauty",
        price: 899,
        discountPrice: 699,
        stock: 150,
        sku: "LUM-SER-30",
        rating: 4.1,
        reviewCount: 640,
        description:
            "15% stabilised L-ascorbic acid with hyaluronic acid and vitamin E to brighten skin tone and fade marks. Fragrance-free, dermatologically tested, suitable for all skin types.",
    },
    {
        name: "Orbit Smart Watch AMOLED",
        brand: "Orbit",
        category: "Mobiles",
        price: 7999,
        discountPrice: 5999,
        stock: 74,
        sku: "ORB-WTCH-1",
        rating: 4.2,
        reviewCount: 387,
        description:
            "1.43-inch AMOLED always-on display, Bluetooth calling, 100+ sport modes, SpO2 and sleep tracking with 10-day typical battery life and 5ATM water resistance.",
    },
    {
        name: "Velocity Carbon Bicycle Helmet",
        brand: "Velocity",
        category: "Sports",
        price: 3499,
        discountPrice: 2899,
        stock: 58,
        sku: "VEL-HLM-CR",
        rating: 4.5,
        reviewCount: 77,
        description:
            "In-mould carbon-fibre reinforced shell, 22 channelling vents, magnetic buckle, washable padding and a rear LED clip. Fits head circumferences 54-61cm.",
    },
    {
        name: "Quill & Craft Leather Journal",
        brand: "Quill & Craft",
        category: "Books",
        price: 749,
        discountPrice: 599,
        stock: 200,
        sku: "QLC-JRN-A5",
        rating: 4.6,
        reviewCount: 122,
        description:
            "Hand-stitched A5 journal with 240 acid-free pages of 120gsm paper, pen loop, ribbon marker and a refillable genuine leather cover that ages beautifully.",
    },
    {
        name: "BlokParty Family Board Game",
        brand: "BlokParty",
        category: "Toys",
        price: 1499,
        discountPrice: 1199,
        stock: 91,
        sku: "BLK-GAME-4",
        rating: 4.3,
        reviewCount: 65,
        description:
            "A bluffing-and-building board game for 2-6 players aged 8+. Ninety minutes of play, colourful wooden pieces and a rulebook with five game variants.",
    },
    {
        name: "TitanGrip Yoga Mat 6mm",
        brand: "TitanGrip",
        category: "Sports",
        price: 1999,
        discountPrice: 1499,
        stock: 110,
        sku: "TTG-MAT-6",
        rating: 4.4,
        reviewCount: 233,
        description:
            "6mm natural rubber mat with a moisture-wicking microfibre top that grips better as you sweat. Alignment lines printed on the surface and a carry strap included.",
    },
    {
        name: "HavenStone Non-Stick Cookware Set",
        brand: "HavenStone",
        category: "Home & Kitchen",
        price: 6999,
        discountPrice: 4999,
        stock: 39,
        sku: "HAV-SET-7",
        rating: 4.3,
        reviewCount: 148,
        description:
            "Seven-piece induction-friendly set with a granite-derived non-stick coating that is PFOA-free. Stay-cool handles, tempered glass lids and oven safety up to 180°C.",
    },
    {
        name: "NovaPods Max Over-Ear Headphones",
        brand: "NovaPods",
        category: "Electronics",
        price: 19999,
        discountPrice: 14999,
        stock: 41,
        sku: "NVA-HDPH-X",
        rating: 4.7,
        reviewCount: 204,
        description:
            "Adaptive hybrid ANC, spatial audio with head tracking, 40mm drivers, multipoint pairing and 50 hours of playback. Faux-leather cushions and a folding travel case.",
    },
    {
        name: "StrideAir Running Shoes",
        brand: "Stride",
        category: "Footwear",
        price: 4599,
        discountPrice: 3499,
        stock: 7,
        sku: "STR-RUN-A3",
        rating: 4.5,
        reviewCount: 412,
        description:
            "Nitrogen-infused foam midsole with a carbon-rubber outsole, engineered knit upper and a rockered geometry that keeps easy miles effortless. Weighs just 238g.",
    },
    {
        name: "Mistral Standing Desk Converter",
        brand: "Mistral",
        category: "Home & Kitchen",
        price: 8999,
        discountPrice: 7499,
        stock: 25,
        sku: "MST-DSK-12",
        rating: 4.2,
        reviewCount: 58,
        description:
            "Gas-spring sit-stand converter fits a 32-inch monitor and a keyboard tray, raising 45cm with one hand. Steel frame holds up to 15kg with no wobble.",
    },
    {
        name: "Kindle-ready Bestseller Box (Set of 3)",
        brand: "PageTurn",
        category: "Books",
        price: 1299,
        discountPrice: 999,
        stock: 130,
        sku: "PGT-BOX-3",
        rating: 4.4,
        reviewCount: 96,
        description:
            "Three contemporary bestsellers in one bundle — literary fiction, a tech thriller and a memoir — with satin bookmarks and a QR code for the author Q&A playlist.",
    },
    {
        name: "PureHarvest Cold-Pressed Almond Oil 1L",
        brand: "PureHarvest",
        category: "Grocery",
        price: 899,
        discountPrice: 749,
        stock: 160,
        sku: "PRH-OIL-1L",
        rating: 4.5,
        reviewCount: 302,
        description:
            "Wood-pressed from single-origin almonds with no refining, additives or preservatives. Kitchen-grade for cooking and gentle enough for skin and hair care.",
    },
    {
        name: "GlowKit 10x Makeup Brush Set",
        brand: "GlowKit",
        category: "Beauty",
        price: 1599,
        discountPrice: 1099,
        stock: 88,
        sku: "GLK-BRS-10",
        rating: 4.0,
        reviewCount: 176,
        description:
            "Ten synthetic-hair brushes with ultra-soft vegan bristles, bamboo handles and a roll-up case. Buffs, blends and lines as cleanly as natural hair.",
    },
    {
        name: "PawBites Grain-Free Dog Treats 2kg",
        brand: "PawBites",
        category: "Grocery",
        price: 1199,
        discountPrice: 999,
        stock: 74,
        sku: "PWB-TRT-2K",
        rating: 4.6,
        reviewCount: 141,
        description:
            "Oven-baked grain-free training treats with chicken as the first ingredient, no artificial colours and added glucosamine for joint health. Suitable for puppies 12 weeks+.",
    },
    {
        name: "EchoPoint Bluetooth Party Speaker",
        brand: "EchoPoint",
        category: "Electronics",
        price: 8999,
        discountPrice: 6999,
        stock: 52,
        sku: "ECP-SPK-40",
        rating: 4.3,
        reviewCount: 189,
        description:
            "40W output with dual passive radiators, 12-hour battery, IPX7 waterproofing, karaoke mic input and light effects that sync to the beat. Pair two for stereo.",
    },
    {
        name: "ComfyNest Memory Foam Pillow (Pack of 2)",
        brand: "ComfyNest",
        category: "Home & Kitchen",
        price: 2499,
        discountPrice: 1799,
        stock: 96,
        sku: "CMF-PLW-2",
        rating: 4.4,
        reviewCount: 267,
        description:
            "CertiPUR-US shredded memory foam pillows with a cooling gel-infused cover, adjustable loft zip and a machine-washable case. Sleep cool and wake up without neck ache.",
    },
    {
        name: "Skyline Kids Remote-Control Stunt Car",
        brand: "Skyline",
        category: "Toys",
        price: 2199,
        discountPrice: 1699,
        stock: 63,
        sku: "SKY-CAR-4W",
        rating: 4.2,
        reviewCount: 84,
        description:
            "360° spinning 4WD stunt car with rechargeable battery, 2.4GHz interference-free remote and rubber wheels that climb over carpets and books. Ages 6+.",
    },
];

const slugify = (name: string): string =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

/**
 * Pushes every seeded stock number to the inventory service so the warehouse
 * starts in agreement with the catalogue (otherwise the NexaGuard inventory
 * sync check reports drift on all 24 demo listings).
 */
const syncWarehouse = async (): Promise<void> => {
    const baseUrl = process.env.INVENTORY_SERVICE_URL ?? "http://localhost:5007";
    const seeded = await Product.find({ sku: { $in: PRODUCTS.map((product) => product.sku) } })
        .select("_id sku stock")
        .lean();

    let synced = 0;

    for (const product of seeded) {
        try {
            const response = await fetch(`${baseUrl}/product/${product._id.toString()}/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sku: product.sku, stock: product.stock }),
            });

            if (!response.ok) {
                console.warn(`Warehouse sync skipped for ${product.sku}: HTTP ${response.status}`);
                continue;
            }

            synced += 1;
        } catch {
            console.warn(
                "Inventory service unreachable — warehouse stock was not synced. " +
                    "Start the services (npm run dev:all) and re-run npm run seed.",
            );
            return;
        }
    }

    console.log(`Warehouse stock synced for ${synced}/${seeded.length} products.`);
};

const seed = async (): Promise<void> => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(uri);
    console.log("Connected — seeding products…");

    let created = 0;
    let updated = 0;

    for (const product of PRODUCTS) {
        const slug = slugify(product.name);

        const update = {
            ...product,
            slug,
            images: [
                `https://picsum.photos/seed/${slug}/640/640`,
                `https://picsum.photos/seed/${slug}-2/640/640`,
                `https://picsum.photos/seed/${slug}-3/640/640`,
            ],
            createdBy: new mongoose.Types.ObjectId("6543210abcdef6543210abcd"),
            isActive: true,
        };

        const result = await Product.updateOne(
            { $or: [{ slug }, { sku: product.sku }] },
            { $set: update },
            { upsert: true },
        );

        if (result.upsertedCount > 0) created += 1;
        else updated += 1;
    }

    console.log(`Products seeded: ${created} created, ${updated} updated.`);

    await syncWarehouse();

    await mongoose.disconnect();
};

seed().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});
