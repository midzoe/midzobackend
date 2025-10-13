import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const universitiesData = [
    {
        name: "Technical University of Munich",
        city: "Munich",
        country: "Germany",
        website: "https://www.tum.de/en",
        applicationUrl: "https://www.tum.de/en/studies/application",
        specialty: "Leading technical university known for engineering and innovation",
        programs: [
            { name: "Computer Science", level: "Bachelor" },
            { name: "Computer Science", level: "Master" },
            { name: "Engineering", level: "Bachelor" },
            { name: "Engineering", level: "Master" },
            { name: "Medicine", level: "Bachelor" },
            { name: "Architecture", level: "Bachelor" },
            { name: "Physics", level: "Bachelor" },
            { name: "Mathematics", level: "Bachelor" }
        ]
    },
    {
        name: "Humboldt University Berlin",
        city: "Berlin",
        country: "Germany",
        website: "https://www.hu-berlin.de/en",
        applicationUrl: "https://www.hu-berlin.de/en/application",
        specialty: "Historic institution in the heart of Berlin with strong humanities programs",
        programs: [
            { name: "Philosophy", level: "Bachelor" },
            { name: "Philosophy", level: "Master" },
            { name: "Law", level: "Bachelor" },
            { name: "Economics", level: "Bachelor" },
            { name: "Literature", level: "Bachelor" },
            { name: "History", level: "Bachelor" },
            { name: "Psychology", level: "Bachelor" }
        ]
    },
    {
        name: "University of Cambridge",
        city: "Cambridge",
        country: "United Kingdom",
        website: "https://www.cam.ac.uk",
        applicationUrl: "https://www.cam.ac.uk/admissions",
        specialty: "A prestigious institution known for academic excellence and groundbreaking research",
        programs: [
            { name: "Computer Science", level: "Bachelor" },
            { name: "Computer Science", level: "Master" },
            { name: "Engineering", level: "Bachelor" },
            { name: "Business", level: "Master" },
            { name: "Law", level: "Bachelor" },
            { name: "Medicine", level: "Bachelor" },
            { name: "Literature", level: "Bachelor" },
            { name: "History", level: "Bachelor" },
            { name: "Physics", level: "Bachelor" }
        ]
    },
    {
        name: "Oxford University",
        city: "Oxford",
        country: "United Kingdom",
        website: "https://www.ox.ac.uk",
        applicationUrl: "https://www.ox.ac.uk/admissions",
        specialty: "World-renowned university with centuries of academic tradition and innovation",
        programs: [
            { name: "Philosophy", level: "Bachelor" },
            { name: "Philosophy", level: "Master" },
            { name: "Economics", level: "Bachelor" },
            { name: "Law", level: "Bachelor" },
            { name: "Medicine", level: "Bachelor" },
            { name: "Literature", level: "Bachelor" },
            { name: "Mathematics", level: "Bachelor" },
            { name: "Chemistry", level: "Bachelor" },
            { name: "Politics", level: "Bachelor" }
        ]
    },
    {
        name: "Sorbonne University",
        city: "Paris",
        country: "France",
        website: "https://www.sorbonne-universite.fr/en",
        applicationUrl: "https://www.sorbonne-universite.fr/en/admissions",
        specialty: "Prestigious French university with rich cultural heritage",
        programs: [
            { name: "Arts", level: "Bachelor" },
            { name: "Literature", level: "Bachelor" },
            { name: "Law", level: "Bachelor" },
            { name: "Medicine", level: "Bachelor" },
            { name: "History", level: "Bachelor" },
            { name: "Philosophy", level: "Bachelor" },
            { name: "Languages", level: "Bachelor" }
        ]
    },
    {
        name: "Sciences Po Paris",
        city: "Paris",
        country: "France",
        website: "https://www.sciencespo.fr/en",
        applicationUrl: "https://www.sciencespo.fr/en/admissions",
        specialty: "Leading institution for political science and international affairs",
        programs: [
            { name: "Political Science", level: "Bachelor" },
            { name: "Political Science", level: "Master" },
            { name: "International Relations", level: "Bachelor" },
            { name: "International Relations", level: "Master" },
            { name: "Law", level: "Bachelor" },
            { name: "Economics", level: "Bachelor" },
            { name: "Journalism", level: "Master" }
        ]
    }
];
async function seedUniversities() {
    try {
        console.log('🌱 Starting universities seeding...');
        for (const universityData of universitiesData) {
            const { programs, ...university } = universityData;
            console.log(`Creating university: ${university.name}`);
            const createdUniversity = await prisma.university.upsert({
                where: { name: university.name },
                update: university,
                create: university
            });
            console.log(`Adding programs for: ${university.name}`);
            for (const program of programs) {
                await prisma.universityProgram.upsert({
                    where: {
                        universityId_name_level: {
                            universityId: createdUniversity.id,
                            name: program.name,
                            level: program.level
                        }
                    },
                    update: program,
                    create: {
                        ...program,
                        universityId: createdUniversity.id
                    }
                });
            }
        }
        console.log('✅ Universities seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Universities seeding failed:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
seedUniversities();
//# sourceMappingURL=seed-universities.js.map