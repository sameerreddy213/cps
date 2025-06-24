import User from "../models/User";
import sampleUsers from "../data/userData";

const seedUsers = async () => {
    try {
        await User.deleteMany({});
        await User.insertMany(sampleUsers);
        console.log("Users inserted successfully");
    } catch (error) {
        console.error("Error seeding users:", error);
        throw error;
    }
};

export default seedUsers; 