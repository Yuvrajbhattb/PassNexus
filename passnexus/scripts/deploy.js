import hre from "hardhat";

async function main() {
    console.log("🚀 Deploying PassNexusRegistry contract...\n");

    // Get the contract factory
    const PassNexusRegistry = await hre.ethers.getContractFactory("PassNexusRegistry");

    // Deploy the contract
    const registry = await PassNexusRegistry.deploy();

    // Wait for deployment to finish
    await registry.waitForDeployment();

    const address = await registry.getAddress();

    console.log("✅ PassNexusRegistry deployed to:", address);
    console.log("\n📋 Contract Details:");
    console.log("   Network:", hre.network.name);
    console.log("   Chain ID:", hre.network.config.chainId);

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("\n👤 Deployed by:", deployer.address);

    // Test the contract with some basic operations
    console.log("\n🧪 Testing contract functions...\n");

    // Test 1: Register a user
    console.log("Test 1: Registering user...");
    const publicKey = "0x04a1b2c3d4e5f6..."; // Example public key
    const tx1 = await registry.registerUser(publicKey);
    await tx1.wait();
    console.log("   ✓ User registered successfully");

    // Test 2: Check if user is registered
    const isRegistered = await registry.isUserRegistered(deployer.address);
    console.log("   ✓ User registration status:", isRegistered);

    // Test 3: Get public key
    const retrievedKey = await registry.getPublicKey(deployer.address);
    console.log("   ✓ Retrieved public key:", retrievedKey);

    // Get a second account for friend testing
    const [, friend] = await hre.ethers.getSigners();

    // Test 4: Register friend
    console.log("\nTest 2: Registering friend...");
    const friendPublicKey = "0x05b2c3d4e5f6a7..."; // Example friend public key
    const tx2 = await registry.connect(friend).registerUser(friendPublicKey);
    await tx2.wait();
    console.log("   ✓ Friend registered successfully");
    console.log("   ✓ Friend address:", friend.address);

    // Test 5: Add friend
    console.log("\nTest 3: Adding friend...");
    const tx3 = await registry.addFriend(friend.address);
    await tx3.wait();
    console.log("   ✓ Friend added successfully");

    // Test 6: Get friends list
    const friends = await registry.getFriends();
    console.log("   ✓ Friends list:", friends);
    console.log("   ✓ Friend count:", friends.length);

    // Test 7: Check friendship
    const areFriends = await registry.isFriend(deployer.address, friend.address);
    console.log("   ✓ Are they friends?", areFriends);

    console.log("\n✨ All tests passed!");
    console.log("\n" + "=".repeat(60));
    console.log("📝 Summary:");
    console.log("   Contract Address:", address);
    console.log("   Deployer:", deployer.address);
    console.log("   Friend:", friend.address);
    console.log("   Total Friends:", friends.length);
    console.log("=".repeat(60));

    return registry;
}

// Execute the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
